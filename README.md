
# TenderVault - Tender Management System

TenderVault is a sophisticated Tender Management System designed to simplify and enhance the tender management process for companies and vendors. This system provides a centralized platform where companies can list their tenders, vendors can place bids, and the admin can oversee and manage the entire process.

## Authors

- [@Souvik3469](https://github.com/Souvik3469)(Souvik Sen)

## Prototype Demo 
https://tender-vault-frontend.vercel.app

## Tech Stack
- FrontEnd: ReactJs, Vite, Tailwind Css
- BackEnd: Node Js, Express, Prisma, MongoDB

<!-- 1
## Installation

To start the project in your local machine

```bash
  git clone https://github.com/Souvik3469/SnapSync.git

  cd .\frontend\
  npm install
  npm run dev

  cd .\backend\
  npm install
  npm run dev

```
```
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`=YOUR_PORT

`MONGO_URI`=YOUR_MONGO_URI

`JWT_SECRET`=YOUR_JWT_SECRET

`SMPT_SERVICE`=YOUR_SMPT_SERVICE(like gmail)

`SMPT_HOST`=YOUR_SMPT_HOST

`SMPT_PORT`=YOUR_SMPT_PORT

`SMPT_MAIL`=YOUR_SMPT_MAIL

`SMPT_PASS`=YOUR_SMPT_PASS

`CLOUDINARY_NAME`=YOUR_CLOUDINARY_NAME

`CLOUDINARY_API_KEY`=YOUR_CLOUDINARY_API_KEY

`CLOUDINARY_API_SECRET`=YOUR_CLOUDINARY_API_SECRET
-->

## Features

### User Authentication: 
- Users (vendors, companies, and admin) can securely log in using their credentials.
#### Register:
![Register](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/register.png)

#### Login:
![Login](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/login.png)

#### Landing Page:
![Landing1](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/Landing1.png)

![Landing2](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/Landing2.png)

### Tender Listing:
- Companies can list tenders with metadata like name, category, description, valid documents, and more.
- Companies can update or delete their tenders.
#### Tender Listing:
![List Tender](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/createtender.png)

#### Tender Update:
![Update Tender](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/updatetender.png)

#### Tender Delete:
![Delete Tender](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/deletetender.png)


### Viewing Tenders:
- Both vendors and companies can view all tenders.
- Sorting options available: by price ranges, by category.
- Search functionality to find individual tenders.
- View sold and unsold tenders separately.
#### View All Tenders:
![View All Tenders](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/Home1.png)

#### Sort by price/category:
![Sort Tenders](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/sorttender.png)

#### Search Functionality:
![Search Tenders](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/search.png)


### Profile Section:
- Company Profile: View company details, sold and unsold tenders.
- Vendor Profile: View bought tenders and personal details.

#### User Profile: 
![User Profile](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/userprofile.png)

### Bid Functionality:
- Vendors can list bids under unsold tenders.
- Deleting bids is allowed (Only the creator of the bid).
- Tender creators can sort bids by price, accept, and reject bids.
- Accepted bids mark the tender as sold to the respective vendor.
#### Add Bid:
![Add Bid](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/addbid.png)

#### Delete Bid:
![Delete Bid](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/deletebid.png)

#### Sort Bid:
![Sort Bid](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/sortbid.png)


#### Reject Bid:
![Reject Bid](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/rejectbid.png)

#### Accept Bid:
![Accept Bid1](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/acceptbid1.png)

![Accept Bid2](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/acceptbid2.png)

### Multilanguage Support:
- Users can select their preferred language.
- The app displays content in the selected language.

#### Multilanguage:
![Multilanguage](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/Multilanguage.png)

### Admin Functionality:
- Admin has superuser access to the database.
- Validates tender and user documents.
- Reviews and rates tenders using a star rating system.

#### Review Tender:
![Review Tender](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/reviewtender.png)

## User Types:
### Vendor:
- Can view all tenders, sort, search, and view bought tenders.
- Place bids on unsold tenders and delete their bids.
### Company:
- Can list, update, and delete tenders.
- View all tenders, sort, search, and view sold and unsold tenders.
- Access the profile section to view company details.
### Admin:
- Superuser with access to the entire system.
- Validates documents, reviews, and rates tenders.
- Performs all functions available to vendors and companies.


### Note: Detailed documentation on functionalities is available in the docs folder.


## License

[MIT](https://choosealicense.com/licenses/mit/)

