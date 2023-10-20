// import React from "react";
// import HeadLine from "components/UiComponents/Headline";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
// import { AppCtx } from "data/Context";

// const Banner = () => {
//   const { selectedProject } = React.useContext(AppCtx);
//   const [projectTech, setProjectTech] = React.useState<any>([]);

//   React.useEffect(() => {
//     setProjectTech(selectedProject?.exp);
//   }, [selectedProject?.exp]);

//   return (
//     <>
//       <div className="grid items-center pt-28">
//         <div className="md:container sm:container mx-auto px-4 lg:px-28">
//           <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 lg:mb-0 mb-20 pt-[0px] lg:pt-0">
//             <div>
//               <HeadLine
//                 text={selectedProject?.disTitle1}
//                 text2={selectedProject?.disTitle2}
//                 className="text-[50px] sm:text-[70px] lg:text-[90px] xl:text-[130px] max-w-xs sm:max-w-sm lg:max-w-lg mb-5"
//               />
//               <p className="font-poppins font-light max-w-xs sm:max-w-sm lg:max-w-lg mb-5">
//                 {selectedProject?.disparg}
//               </p>
//               <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-1 w-2/3 lg:w-3/5">
//                 {projectTech?.length < 1
//                   ? "no data"
//                   : projectTech?.map((list: any, index: any) => {
//                       return (
//                         <div
//                           key={index}
//                           className={`w-fit p-1 px-4 rounded-full mb-5 backdrop-opacity-10 backdrop-invert bg-${list.bg}/20`}
//                         >
//                           <p
//                             className={`relative`}
//                             style={{ color: list?.color }}
//                           >
//                             {list?.title}
//                           </p>
//                         </div>
//                       );
//                     })}
//               </div>
//               <h3 className="uppercase mt-5 font-bold cursor-pointer w-fit">
//                 view project{" "}
//                 <FontAwesomeIcon
//                   className="rotate-[-45deg] ml-2"
//                   icon={faArrowRight}
//                   color="#FFA100"
//                 />
//               </h3>
//             </div>
//             <div>
//               <img
//                 className="h-[20rem] sm:h-[30rem] lg:h-[26rem] xl:h-[33rem] w-auto mx-auto pt-6 lg:pt-0"
//                 src={selectedProject?.disimg1}
//                 alt=""
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Banner;