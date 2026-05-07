deVere Product Explorer - Frontend Technical Test
Project Overview
This application is a product catalogue interface built for deVere Group's stakeholder attire collection. It allows users to browse business attire products, search by title or category, view detailed product information, and add new products to the catalogue.

The application was developed as part of a frontend technical assessment, demonstrating comprehensive implementation of modern Angular practices, responsive design, state management, and API integration.

Live Demo Features
Browse a curated collection of business attire products

Search products by title or category in real-time

View detailed product information including pricing, ratings, and descriptions

Add new products to the catalogue through a validated form

Responsive layout that adapts seamlessly from desktop to mobile devices

Proper loading indicators during API operations

User-friendly error messages with retry functionality

Empty state handling when no products match search criteria

Technology Stack
Framework: Angular 19.2.x with standalone components

Language: TypeScript 5.7.x

State Management: NgRx SignalStore for reactive state handling

Styling: Tailwind CSS for utility-first responsive design

Mock API: JSON Server for local development and testing

HTTP Client: Angular's native HttpClient with modern fetch API support

Architecture Decisions
State Management with SignalStore
I chose NgRx SignalStore over classic NgRx Store for several reasons. SignalStore integrates seamlessly with Angular's signals, reducing boilerplate code while maintaining predictable state updates. It provides computed values for derived state like filtered products and statistics, and rxMethod for handling asynchronous operations. This approach keeps the store clean, testable, and performant.

The store manages products, search term, selected product ID, loading status, and error states. Computed signals handle filtered products, unique categories, loading indicators, and empty state detection.

Standalone Components
The application uses Angular's standalone component architecture, eliminating the need for NgModules. This simplifies the structure, reduces complexity, and aligns with Angular's modern recommended patterns. Each component is self-contained with its own template, styles, and dependencies declared directly in the component.

Styling Approach
Tailwind CSS provides consistent, responsive styling without writing custom CSS. The colour scheme follows deVere Group's brand identity: deep navy backgrounds, teal accents for all interactive elements, white text on dark surfaces, and near-black text on light surfaces. All components use utility classes directly in templates, ensuring visual consistency across the application.

API Integration
JSON Server provides a realistic REST API experience during development. The service layer abstracts HTTP calls, making it easy to swap the mock API with a real backend later. All API calls include proper error handling and loading states.

Folder Structure
text
src/
├── app/
│   ├── features/
│   │   └── products/
│   │       ├── components/
│   │       │   ├── loading-spinner/
│   │       │   ├── product-card/
│   │       │   └── product-form/
│   │       ├── models/
│   │       │   └── product.model.ts
│   │       ├── pages/
│   │       │   ├── product-list-page/
│   │       │   └── product-detail-page/
│   │       ├── services/
│   │       │   └── product.service.ts
│   │       └── stores/
│   │           └── product.store.ts
│   ├── shared/
│   │   └── services/
│   │       └── api.service.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── images/
│   ├── image0.jpeg
│   ├── image1.jpeg
│   ├── image2.jpeg
│   └── image3.jpeg
├── db.json
└── styles.scss
Setup Instructions
Prerequisites
Node.js 18.x or higher

npm 9.x or higher

Installation Steps
Clone the repository

bash
git clone [repository-url]
cd product-explorer-signalstore
Install dependencies

bash
npm install
Start the JSON Server (mock API)

bash
npx json-server --watch db.json --port 3000
In a separate terminal, start the Angular development server

bash
ng serve
Open your browser and navigate to http://localhost:4200

The application will automatically reload when you make changes to the source files.

Features Documentation
Product Listing Page
The main page displays products in a responsive grid layout. On desktop, three products appear per row. On tablet, two products per row. On mobile, a single column layout ensures easy scrolling and tapping.

Each product card shows the product image, title, category, rating, a brief description, price, and a View Details button. The card expands slightly on hover to provide visual feedback.

Search Functionality
Users can search products by typing in the search bar. The application filters products in real-time based on matching title or category text. The search term appears in the statistics cards for clarity, and a clear button removes the filter when clicked.

Statistics Display
Three statistic cards show the total number of products, the number of unique categories, and the current active search term. These update automatically as products are added or filters change.

Product Detail View
Clicking View Details on any product navigates to a dedicated detail page. This page shows a larger product image, complete description, price, rating, category, and product ID. A back button returns to the listing page.

Add Product Functionality
Users can add new products through a form that appears when clicking the Add Product button. The form includes validation for required fields and proper price formatting. While a product is being added, the submit button shows an Adding indicator and prevents duplicate submissions.

State Management Features
Loading indicators appear during API calls for products

Error messages with retry buttons appear when API calls fail

Empty state messages show when no products exist

No results messages appear when searches return no matches

Statistics update automatically when products are added or filtered

Responsive Design Breakpoints
Mobile: Up to 640px (single column layout)

Tablet: 641px to 768px (two column layout)

Desktop: 769px and above (three column layout)

All components use responsive padding, font sizes, and spacing to ensure usability across all device sizes.

Trade-offs and Assumptions
Assumptions
Product images are stored locally in the images folder rather than using external URLs for demonstration purposes

JSON Server automatically generates string IDs for new products, which are handled correctly throughout the application

The application assumes a stable network connection, though error handling is in place for failures

Product categories are free text rather than a predefined list for maximum flexibility

Trade-offs
I chose SignalStore over classic NgRx to reduce boilerplate while maintaining state management benefits. This trades some ecosystem maturity for development speed and simplicity.

Local images were used instead of external APIs to ensure the application works offline and demonstrates proper asset handling.

The add product feature uses optimistic UI updates, adding the product to the local state immediately after API confirmation rather than refetching the entire list.

Tailwind CSS was chosen over component libraries for complete control over branding and reduced bundle size, trading off against having pre-built accessible components.

Known Limitations
Product images must be manually added to the images folder and referenced by filename

Deleting and editing functionality was intentionally excluded per requirements but can be added if needed

The application relies on JSON Server being run on port 3000; changing this requires updating the API service base URL

Search is case-insensitive but does not support fuzzy matching or partial word searching

AI Usage Disclosure
Tools Used
GitHub Copilot

Anthropic's Claude (via web interface)

Parts of the Test Involving AI Assistance
Initial project scaffolding: AI helped generate the folder structure and basic component templates

State management implementation: AI assisted with SignalStore patterns and rxMethod configuration

Tailwind CSS colour scheme: AI helped translate deVere brand colours into Tailwind configuration

Debugging: AI assisted in identifying the duplicate product submission bug and suggesting fixes

Responsive design: AI helped write responsive utility class combinations

How AI Was Used
I used AI to accelerate development by generating boilerplate code, suggesting component structures, and providing alternative solutions when stuck. For each AI suggestion, I reviewed the code, tested it thoroughly, and made adjustments based on my understanding of the requirements. AI helped me think through edge cases like empty states and error handling. 

What I Verified Myself
All API integration logic and HTTP request handling

Form validation rules and user feedback

Responsive layout testing across different screen sizes

State management correctness and performance

TypeScript type safety across all interfaces

The duplicate product bug fix and its verification

Output Not Used
AI suggested using NgRx Store classic for state management, but I chose SignalStore instead because it better aligns with Angular 19's modern patterns and reduces boilerplate. AI also suggested using external image URLs, but I opted for local images to ensure reliability.