import * as Carousel from "./Carousel.js";
import axios from "axios";

const breedSelect = document.getElementById("breedSelect");
const infoDump = document.getElementById("infoDump");
const progressBar = document.getElementById("progressBar");
const getFavouritesBtn = document.getElementById("getFavouritesBtn");
const carouselInner = document.getElementById("carouselInner");
const API_KEY =
  "live_uwVpJpUOl63InRwFz5LYpLVooFYJ1rhQb54HdObcyki3IrIxmVCuxpXgkvMvcUNT";

const BASE_URL = "https://api.thecatapi.com/v1";

/**
 * 1. Create an async function `initialLoad` that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */
// Initialize the app
// document.addEventListener("DOMContentLoaded", initialLoad);

initialLoad();

async function initialLoad() {
  console.log("OK");
  try {
    // breed options
    const breeds = await fetchBreeds();
    populateBreedSelect(breeds);

    //  fetch first breed
    if (breeds.length > 0) {
      fetchBreedData(breeds[0].id);
    }
    // Event listener for breed selection
    breedSelect.addEventListener("change", (event) => {
      const breedId = event.target.value;
      if (breedId) fetchBreedData(breedId);
    });

    // Event listener for "Get Favourites" button
    getFavouritesBtn.addEventListener("click", getFavourites);
  } catch (error) {
    console.error("Error during initial load:", error);
  }
}

async function fetchBreeds() {
  try {
    const response = await fetch(`${BASE_URL}/breeds`, {
      headers: { "x-api-key": API_KEY },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching breeds:", error);

    //   return await handleFetchError(response);
    // } catch (error) {
    //   console.error("Error fetching breeds:", error);
    //   throw error;
  }
}

async function fetchBreedData(breedId) {
  console.log("fetchBreedData():", breedId);
  try {
    // Fetch images and breed details
    const queryParams = new URLSearchParams({
      breed_id: breedId,
      limit: 10,
    }).toString();
    console.log(`${BASE_URL}/images/search?${queryParams}`);
    const imagesResponse = await fetch(
      `${BASE_URL}/images/search?${queryParams}`,
      {
        headers: { "x-api-key": API_KEY },
      }
    );

    const images = await imagesResponse.json();
    console.log(images);

    const breedResponse = await fetch(`${BASE_URL}/breeds/${breedId}`);
    const breedData = await breedResponse.json();
    console.log(breedData);

    // const breedData = await handleFetchError(breedResponse);

    // const [imagesResponse, breedResponse] = await Promise.all([imagesFetch,
    //   fetch(`${BASE_URL}/breeds/${breedId}`, {
    //     headers: { "x-api-key": API_KEY },
    //   }),
    // ]);

    // const images = await handleFetchError(imagesResponse);
    // const breedData = await handleFetchError(breedResponse);

    // Clear and update the carousel
    updateCarousel(images);

    // Update the information section
    infoDump.innerHTML = `
      <h3>${breedData.name}</h3>
      <p><strong>Origin:</strong> ${breedData.origin}</p>
      <p><strong>Temperament:</strong> ${breedData.temperament}</p>
      <p><strong>Description:</strong> ${breedData.description}</p>
    `;
  } catch (error) {
    console.error("Error fetching breed data:", error);
  }
}

function updateCarousel(images) {
  carouselInner.innerHTML = ""; // Clear existing items

  images.forEach((image) => {
    // const imgElement = document.createElement("img");
    // imgElement.src = image.url;
    // imgElement.alt = "Cat image";
    // imgElement.classList.add("carousel-item");
    // carouselInner.appendChild(imgElement);
    const imgElement = Carousel.createCarouselItem(
      image.url,
      "Cat image",
      image.id
    );
    Carousel.appendCarousel(imgElement);
  });

  Carousel.start();
}

function populateBreedSelect(breeds) {
  breedSelect.innerHTML = "";

  breeds.forEach((breed) => {
    const option = document.createElement("option");
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
}

function handleFetchError(response) {
  if (!response.ok) {
    return response.text().then((text) => {
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${text}`
      );
    });
  }
  return response.json();
}

async function getFavourites() {
  try {
    const response = await fetch(`${BASE_URL}/favourites`, {
      headers: { "x-api-key": API_KEY },
    });
    const favourites = await handleFetchError(response);

    // Clear and update the carousel with favourites
    updateCarousel(favourites.map((fav) => ({ url: fav.image.url })));
  } catch (error) {
    console.error("Error fetching favourites:", error);
  }
}

//axios code

/*
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

/* 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab." */
/*
//  * 4. Change all of your fetch() functions to axios!
//  * - axios has already been imported for you within index.js.
//  * - If you've done everything correctly up to this point, this should be simple.
//  * - If it is not simple, take a moment to re-evaluate your original code.
//  * - Hint: Axios has the ability to set default headers. Use this to your advantage
//  *   by setting a default header with your API key so that you do not have to
//  *   send it manually with all of your requests! You can also set a default base URL!
//  */

// /**
//  * 5. Add axios interceptors to log the time between request and response to the console.
//  * - Hint: you already have access to code that does this!
//  * - Add a console.log statement to indicate when requests begin.
//  * - As an added challenge, try to do this on your own without referencing the lesson material.
//  */

// /**
//  * 6. Next, we'll create a progress bar to indicate the request is in progress.
//  * - The progressBar element has already been created for you.
//  *  - You need only to modify its "width" style property to align with the request progress.
//  * - In your request interceptor, set the width of the progressBar element to 0%.
//  *  - This is to reset the progress with each request.
//  * - Research the axios onDownloadProgress config option.
//  * - Create a function "updateProgress" that receives a ProgressEvent object.
//  *  - Pass this function to the axios onDownloadProgress config option in your event handler.
//  * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
//  *  - Update the progress of the request using the properties you are given.
//  * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
//  *   once or twice per request to this API. This is still a concept worth familiarizing yourself
//  *   with for future projects.
//  */
// function updateProgress(event) {
//   if (event.lengthComputable) {
//       const percentComplete = (event.loaded / event.total) * 100;
//       progressBar.style.width = `${percentComplete}%`;
//   }
// }
/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */

/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */
// async function getFavourites() {
//   try {
//     // get favorites
//     const response = await axios.get('https://api.thecatapi.com/v1/favourites', {
//       headers: { 'x-api-key': API_KEY }
//     })};
// Clear carousel
// const carouselInner = document.getElementById('carouselInner');
// carouselInner.innerHTML = '';

// Bind the event listener to the button
// const getFavouritesBtn = document.getElementById('getFavouritesBtn');
// getFavouritesBtn.addEventListener('click', getFavourites);

// your code here

// @param {string} imgId

// // export async function favourite(imgId) {
// //   try {
// //     const { data: favourites } = await axios.get("/favourites");
// //     const isFavourited = favourites.some((fav) => fav.image_id === imgId);

// //     if (isFavourited) {
// //       await axios.delete(`/favourites/${imgId}`);
// //     } else {
// //       await axios.post("/favourites", { image_id: imgId });
// //     }

// //     // Refresh the carousel after toggling favourite
// //     const selectedBreedId = breedSelect.value;
// //     if (selectedBreedId) fetchBreedData(selectedBreedId);
// //   } catch (error) {
// //     console.error("Error toggling favourite:", error);
// //   }
// * 10. Test your site, thoroughly!
//  * - What happens when you try to load the Malayan breed?
//  *  - If this is working, good job! If not, look for the reason why and fix it!
//  * - Test other breeds as well. Not every breed has the same data available, so
//  *   your code should account for this.
