import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useQuestionsQuery,
  useAskQuestion,
  useAnswerQuestion,
} from "../../api/tender";
import { GetMyDetailsQuery } from "../../api/user";
import {
  RiQuestionAnswerLine,
  RiSendPlaneLine,
  RiAddLine,
  RiChat1Line,
} from "react-icons/ri";
import { toast } from "react-toastify";
import Avatar from "../ui/Avatar";

const showToast = (msg, type = "error") =>
  toast[type](msg, {
    position: "top-center",
    autoClose: 3500,
    hideProgressBar: true,
    theme: "light",
  });

const timeAgo = (iso) => {
  if (!iso) return "";
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const QASection = ({ tenderStatus }) => {
  const { tenderId } = useParams();
  const [questionText, setQuestionText] = useState("");
  const [answerTexts, setAnswerTexts] = useState({});
  const [answeringId, setAnsweringId] = useState(null);

  const { data: user } = GetMyDetailsQuery();
  const { data: questions = [], isLoading } = useQuestionsQuery(tenderId);
  const { mutate: askQ, isLoading: askingQ } = useAskQuestion(tenderId);
  const { mutate: answerQ, isLoading: answeringQ } = useAnswerQuestion(tenderId);

  const handleAsk = () => {
    const text = questionText.trim();
    if (!text) return;
    askQ(text, {
      onSuccess: () => {
        showToast("Question posted!", "success");
        setQuestionText("");
      },
      onError: (err) =>
        showToast(err?.response?.data?.message ?? "Failed to post question"),
    });
  };

  const handleAnswer = (questionId) => {
    const text = answerTexts[questionId]?.trim();
    if (!text) return;
    answerQ(
      { questionId, answer: text },
      {
        onSuccess: () => {
          showToast("Answer posted!", "success");
          setAnswerTexts((prev) => ({ ...prev, [questionId]: "" }));
          setAnsweringId(null);
        },
        onError: (err) =>
          showToast(err?.response?.data?.message ?? "Failed to post answer"),
      }
    );
  };

  const canAnswer = ["company", "admin"].includes(user?.role);
  const canAsk = user?.role === "vendor" && tenderStatus === "open";

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <RiQuestionAnswerLine className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold text-slate-900">
          Q&amp;A Clarifications
        </h2>
        <span className="text-sm font-normal text-slate-400">
          ({questions.length})
        </span>
      </div>

      {/* Ask a question — vendors on open tenders only */}
      {canAsk && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wide">
            Ask a clarification question
          </p>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Type your question about this tender's requirements or scope…"
            rows={2}
            className="input resize-none mb-2"
          />
          <button
            onClick={handleAsk}
            disabled={askingQ || !questionText.trim()}
            className="btn-primary btn-sm flex items-center gap-1.5"
          >
            <RiSendPlaneLine className="w-3.5 h-3.5" />
            {askingQ ? "Posting…" : "Post Question"}
          </button>
        </div>
      )}

      {/* Question list */}
      {isLoading ? (
        <p className="text-sm text-slate-400 text-center py-10">
          Loading questions…
        </p>
      ) : questions.length === 0 ? (
        <div className="text-center py-10">
          <RiChat1Line className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-medium">No questions yet</p>
          {canAsk && (
            <p className="text-xs text-slate-400 mt-1">
              Ask about the tender's scope, requirements, or eligibility.
            </p>
          )}
          {!canAsk && tenderStatus === "open" && (
            <p className="text-xs text-slate-400 mt-1">
              Vendors can post clarification questions here.
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className="border border-slate-100 rounded-xl overflow-hidden"
            >
              {/* Question row */}
              <div className="flex gap-3 p-4">
                <Avatar
                  src={q.asker?.profileImage}
                  name={q.asker?.name}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-800">
                      {q.asker?.name ?? "Vendor"}
                    </span>
                    <span className="text-xs text-slate-400">
                      {timeAgo(q.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {q.text}
                  </p>
                </div>
              </div>

              {/* Answers */}
              {q.answers?.length > 0 && (
                <div className="border-t border-slate-100 bg-slate-50/60">
                  {q.answers.map((ans) => (
                    <div
                      key={ans.id}
                      className="flex gap-3 px-4 py-3 border-b border-slate-100 last:border-0"
                    >
                      <Avatar
                        src={ans.owner?.profileImage}
                        name={ans.owner?.name}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-800">
                            {ans.owner?.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 font-semibold capitalize">
                            {ans.owner?.role}
                          </span>
                          <span className="text-xs text-slate-400">
                            {timeAgo(ans.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {ans.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Answer form — company / admin */}
              {canAnswer && (
                <div className="border-t border-slate-100 px-4 py-3">
                  {answeringId === q.id ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={answerTexts[q.id] ?? ""}
                        onChange={(e) =>
                          setAnswerTexts((prev) => ({
                            ...prev,
                            [q.id]: e.target.value,
                          }))
                        }
                        placeholder="Type your official answer…"
                        rows={2}
                        className="input resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAnswer(q.id)}
                          disabled={answeringQ || !answerTexts[q.id]?.trim()}
                          className="btn-primary btn-sm flex items-center gap-1.5"
                        >
                          <RiSendPlaneLine className="w-3.5 h-3.5" />
                          {answeringQ ? "Posting…" : "Post Answer"}
                        </button>
                        <button
                          onClick={() => setAnsweringId(null)}
                          className="btn-secondary btn-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAnsweringId(q.id)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <RiAddLine className="w-3.5 h-3.5" />
                      {q.answers?.length > 0 ? "Add another answer" : "Answer this question"}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QASection;
