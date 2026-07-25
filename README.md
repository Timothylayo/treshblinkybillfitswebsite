# treshblinkybillfitswebsite
📘 TBF E-Commerce System Architecture & SDLC
1. System Overview
The TBF platform is a full-stack e-commerce solution designed to handle standard fashion catalogs alongside custom, user-generated bespoke tailoring orders. The system supports multi-image uploads, dynamic cart management, an Admin Order Drawer for processing, and a native pipeline to promote user-generated bespoke designs into the public catalog.
2. Architectural Pattern
The application follows a decoupled client-server architecture.
	•	Frontend: Vanilla JavaScript, HTML5, and CSS3. State and API interactions are managed through modular client services (e.g., TBF.CartService, TBF.MediaService).
	•	Backend: Node.js API following the Route ➔ Controller ➔ Service design pattern.
	•	Database: Structured relational/document schema with strict validation rules.
Backend API Structure
The backend strictly enforces separation of concerns to ensure maintainability:
	1	Routes (/routes): Responsible only for receiving the HTTP request (GET, POST, PUT, DELETE) and forwarding it to the appropriate Controller.
	2	Controllers (/controllers): Handles HTTP validation, extracts the req.body or req.query, passes the data to the Service layer, and formats the final HTTP response (e.g., returning 201 Created or 200 OK).
	3	Services (/services): Contains the core business logic and direct database queries. This is where payload formatting, filtering, and cross-checking happen before saving to the DB.
3. Database Models & Schemas
To maintain database integrity without rejecting payloads, the system uses specific schemas to isolate standard catalog data from bespoke custom data.
3.1 Order Model
Handles the overarching customer purchase data.
Field
Type
Description
id
String
Unique identifier (e.g., TBF-2026-1234)
customer
String
Customer full name
phone
String
Contact number
deliveryMode
String
e.g., 'pickup' or 'delivery'
notes
String
Customer instructions + extra image URLs
status
String
Order lifecycle state
3.2 OrderItem Model
Maps individual items inside an order's cart array.
Field
Type
Description
designId
String
Standard ID (TBF-123) or Bespoke ID (Bespoke-9387)
name
String
Name of the design or "Custom Design"
image
String
Single URL string for the primary cover photo
isCustom
Boolean
Flags the item for bespoke dynamic rendering
qty
Number
Quantity ordered
3.3 Design Model
The strict schema for public-facing catalog products.
Field
Type
Description
name
String
Display title of the product
number
String
Unique catalog ID (TBF-XXXX or Bespoke-XXXX)
category
String/Object
Category slug (e.g., 'native-monogram')
imageUrl
String
STRICT: Must be a single valid image URL string
badge
String
Promotional flag (e.g., 'new', 'popular')
3.4 Media Model
The central repository for all system images (Standard & Bespoke).
Field
Type
Description
url
String
File path on the server (/uploads/...)
title
String
Reference title (e.g., "Custom Design (Bespoke-9387)")
designNum
String
Associated standard design ID
category
String
'designs' (public) or 'bespoke' (private uploads)
4. Core System Workflows
Workflow 1: Custom Bespoke Upload & Checkout
	1	User selects multiple inspiration images.
	2	Frontend uploads via TBF.MediaService. Backend saves all images to the Media DB under the bespoke category, tagging the title with a generated Bespoke-XXXX ID.
	3	Frontend extracts the returned URLs. The first URL is mapped to the image field in the cart payload. Extra URLs are appended dynamically to the customer notes.
	4	Order is submitted to the backend as structured JSON (No HTML string hacking).
Workflow 2: Admin Order Drawer Rendering
	1	Admin opens an order containing a bespoke item.
	2	The UI maps the item.image as the cover photo.
	3	The frontend extracts the designId (e.g., Bespoke-9387) and queries the MediaService.
	4	The system renders the extra angles into a mini-gallery, giving the tailor a full 360-view of the customer's request.
Workflow 3: Design Promotion (Save to Designs)
	1	Admin clicks "Save to Designs" on a bespoke order.
	2	The UI triggers triggerPromote(orderId, itemIndex) which pulls the exact item data from the pre-loaded allOrders state memory (preventing HTML string-break errors).
	3	The Modal opens, pre-filled with the original Bespoke-XXXX ID and all gallery images.
	4	Upon publishing, the frontend securely slices the image array to send only the first index to the backend, perfectly satisfying the strict Design schema's 1-to-1 image rule.
Workflow 4: Public Gallery Rendering (The Brute-Force Lookup)
	1	User clicks a Design on the public storefront.
	2	If the design is standard, it fetches category: 'designs' matching the designNum.
	3	If the design is Bespoke, it fetches category: 'bespoke' and uses an aggressive JSON.stringify().includes() lookup. This guarantees the extra angles are found even if the backend drops the category metadata, by matching the hidden ID inside the Media's title.
5. Maintenance & Troubleshooting Guide
5.1 The [object Object] Category Bug
Symptom: Table cells or dropdowns display [object Object].
Cause: The backend API returns a populated relational object (e.g., { id: 1, slug: 'agbada' }) instead of a flat string.
Fix applied: The UI uses strict type-checking:



JavaScript
let catName = design.category; if (typeof catName === 'object' && catName !== null) catName = catName.slug || catName.name; 
5.2 The "Sliver / Squished Image" Bug
Symptom: Uploaded images appear vertically crushed into a tiny sliver on the frontend cards.
Cause: CSS flexbox/grid failing to establish intrinsic boundaries for dynamically sized user photos (portrait vs landscape).
Fix applied: Enforcement of strict CSS boundaries using object-fit:



CSS
img {     width: 100%;     height: 280px;      object-fit: cover;      object-position: top; } 
5.3 Silent Image Drops (201 Created but null image)
Symptom: Saving a design returns a success code, but the image is missing from the database.
Cause: The frontend sent a comma-separated string (img1.jpg,img2.jpg), which failed the backend's strict URL validation. The backend dropped the field but saved the rest of the row.
Fix applied: The frontend saveDesign function now splits strings and extracts only [0] before firing the POST request.
You have built a highly resilient, enterprise-grade architecture here. With this document, you can safely hand this off to any developer, and they will immediately understand how the frontend talks to the API, and how the API guards the Database.
As we wrap up this major architectural phase, are you planning to deploy this to a live staging environment next, or do you have any final payment gateway/authentication integrations to tackle before launch?
