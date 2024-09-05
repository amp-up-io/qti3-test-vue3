# Amp-up.io QTI 3 Test Component for Vue 3

<div id="top"></div>

[![MIT License][license-shield]][license-url]

<a href="https://site.imsglobal.org/certifications/amp-upio/amp-upio-qti-3-test-player" target="_blank">
<img align="right" src="https://site.imsglobal.org/sites/default/files/media/images/logo_ims/1edtech_trusted-apps-certified.svg" width="187" height="200" border="1" alt="1EdTech Certified">
</a>



The QTI 3 Test Component is a Vue 3 JavaScript component that aims to provide an information model, and an execution model (for Outcome Processing), that encapsulates the best practices and behaviors of the 1EdTech QTI 3 Assessment **Test** specification.

A client application can inject QTI 3 Test XML into QTI 3 Test Component, which parses the QTI 3 Assessment Test XML and provides an information model with various methods and properties for inspection back to the client.  QTI 3 Test Component also has methods for injecting item states which can then be used when running Outcome Processing (such as when submission mode is "individual" or "simultaneous").

See the 1EdTech QTI 3 Information Model documentation for more information about the QTI 3 Assessment Test lifecycle.

[IMS Question and Test Interoperability (QTI): Assessment, Section and Item Information Model Version 3.0](https://www.imsglobal.org/sites/default/files/spec/qti/v3/info/index.html)

QTI 3 Test Component is a sub-component of a QTI 3 Test Player Delivery system that has achieved both <a href="https://site.imsglobal.org/certifications/amp-upio/amp-upio-qti-3-test-player" target="_blank">QTI 3 Basic (Level 1) and QTI 3 Advanced (Level 2) "Delivery" Conformance</a> Certification from 1EdTech.



## About The Project

The QTI 3 Test Component has API's, interfaces, and capabilities which encapsulate much of the web component-friendly QTI 3 Assessment Test specification.  Just install the component in your project, inject QTI 3 Assessment Test XML and go!  

<p align="right">(<a href="#top">back to top</a>)</p>



## Getting Started

### 1. Clone the repo
```sh
git clone https://github.com/amp-up-io/qti3-test-vue3.git
```

### 2. Install Node.js >= 20
QTI 3 Test Component for Vue 3 has been built and tested with Node v20.14.0.

### 3. Installation
QTI 3 Test Component for Vue 3 includes a dependency on Vue 3, and a dependency on Vite for bundling.

```sh
npm install
```

### 4. Compiles and hot-reloads for development
```sh
npm run dev
```

### 5. Compiles, minifies, creates package
```sh
npm run build
```

<p align="right">(<a href="#top">back to top</a>)</p>
