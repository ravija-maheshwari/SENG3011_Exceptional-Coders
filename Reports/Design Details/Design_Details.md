### 1. Describe how you intend to develop the API module and provide the ability to run it in Web service mode**

Firebase

### 2. Discuss your current thinking about how parameters can be passed to your module and how results are collected. Show an example of a possible interaction. (e.g.- sample HTTP calls with URL and parameters)

Parameters can be passed to the module by using *query paramters*. Query paramaters can be used to define the mode that the API is running in, and also allow for the collection of results. For example the module could accept a URL in the following form:`[hostname]?start_time=1582548876end_time=1589548213`

### 3. Present and justify implementation language, development and deployment environment (e.g. Linux, Windows) and specific libraries that you plan to use.

#### Firebase:
- Set up: Setting a project up with Firebase is very simple through the console.
- Extensions:
- NoSQL: The outbreak information on FluTrackers is in the form of links to many other websites, each of which may have different standards for the data they provide. It is much more convenient to store this less structured data in a NoSQL database (i.e. Cloud Firestore).
- Interoperability: Support for iOS, Android, Web users, and any HTTPS client.
- Integration: Firebase combines the server, API and datastore in one place.
- Scalability: Cloud-based storage and asynchronous API allows for easy scalability to millions of users.
- Security: Firebase only supports HTTPS requests, which provides the benefit of using Transport Layer Security to protect any transmitted data from tampering (say by a foreign actor trying to distort our epidemic statistics).
- Support: Firebase has extensive documentation available and a very explanatory YouTube channel.

#### Node.js:
- Axios - HTTP client
- Cheerio - scraper
- Puppeteer - library to control Google Chrome


<!-- Maybe remove this table -->
| Design Decision         | Selection & Justification |
| ----------------------- | ------------------------- |
| Development Language    |                           |
| Development Environment |                           |
| Deployment Environment  |                           |
| Architectural Framework |                           |