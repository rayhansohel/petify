// ------ Custom Tailwind CSS ------ //
tailwind.config = {
  theme: {
      extend: {
          colors: {
              brandColor: '#9002F1',
          },
          fontFamily: {
              lato: ['Lato', 'sans-serif'],
          },
          scrollBehavior: {
              'smooth': 'smooth',
          }
      }
  }
};



// ------ Global variable to store all pet data ------ //
let allPetsData = [];



// ------ Show Spinner when loading ------ //
const showSpinner = () => {
  const spinner = document.getElementById('spinner');
  const petContent = document.getElementById('pet-content');
  
  spinner.classList.remove('hidden');
  petContent.classList.add('hidden');
};
// ------ Hide Spinner after loading ------ //
const hideSpinner = () => {
  const spinner = document.getElementById('spinner');
  const petContent = document.getElementById('pet-content');
  
  spinner.classList.add('hidden');
  petContent.classList.remove('hidden');
};



// ------ Fetch all pets ------ //
const fetchAllPets = async (category) => {

  // ------ Show Spinner before fetch data ------ //
  showSpinner();

  const fetchUrl = category 
      ? `https://openapi.programming-hero.com/api/peddy/category/${category}` 
      : `https://openapi.programming-hero.com/api/peddy/pets`;

  try {
      const response = await fetch(fetchUrl);
      const data = await response.json();
      allPetsData = data.data || data.pets || [];
      displayAllPets(allPetsData);
  } catch (error) {
      console.error('Error:', error);
  } finally {
      setTimeout(() => {
          hideSpinner();
      }, 2000);
  }
};



// ------ Display all pets ------ //
const displayAllPets = (data) => {
    const petContainer = document.getElementById("pet-container");
    petContainer.innerHTML = ""; 
    if (data.length === 0) {
        petContainer.innerHTML = `
            <div class="grid col-span-1 md:col-span-3 h-full border rounded-2xl min-h-96 justify-center items-center text-center py-20 px-4">
                <div class="container m-auto flex flex-col justify-center items-center max-w-[400px] md:max-w-[600px] text-center">
                    <div>
                        <img src="assets/error.webp" alt="No Information">
                    </div>
                    <h2 class="text-2xl font-extrabold">No Information Available</h2>
                    <p class="my-4">There is no information available regarding this topic at the moment. Please check back later for updates.</p>
                </div>
            </div>`;
        return;
    }
    //-------Create pet cards ------//
    data.forEach(pet => {
        const div = document.createElement("div");
        div.className = "border rounded-2xl p-4";
        div.innerHTML = `
        <div class="rounded-xl ">
            <img class="md:h-48 w-full object-cover rounded-xl" src="${pet.image}" alt="${pet.pet_name}">
        </div>
        <div> 
            <h2 class="text-2xl font-extrabold my-3">${pet.pet_name}</h2>
        </div>
        <div class="mb-4">
            <ul class="flex flex-col gap-1">
                <li>
                    <i class="text-xl mr-3 text-brandColor fa-solid fa-sun"></i> 
                    <span class="font-bold">Breed: </span>${pet.breed || "Not available"}
                </li>
                <li>
                    <i class="text-xl mr-3 text-brandColor fa-solid fa-calendar-days"></i> 
                    <span class="font-bold">Birth: </span>${pet.date_of_birth || "Not available"}
                </li>
                <li>
                    <i class="text-xl mr-3 text-brandColor fa-solid fa-mercury"></i> 
                    <span class="font-bold">Gender: </span>${pet.gender || "Not available"}
                </li>
                <li>
                    <i class="text-xl mr-3 text-brandColor fa-solid fa-tags"></i> 
                    <span class="font-bold">Price: </span>${pet.price ? `${pet.price} $` : "Not available"}
                </li>
            </ul>
        </div>
          <div class="flex justify-between pt-4 border-t">
              <button onclick=fetchImage('${pet.image}') class="py-2 px-4 border-2 hover:border-brandColor text-brandColor hover:bg-brandColor hover:text-white rounded-xl transition-colors duration-500"><i class="fa-regular fa-thumbs-up"></i></button>
              <button onclick="showAdoptModal(this)" class="py-2 px-6 border-2 hover:border-brandColor text-brandColor hover:bg-brandColor hover:text-white rounded-xl transition-colors duration-500">Adopt</button>
              <button onclick="showModal('${pet.image}', '${pet.pet_name.replace(/'/g, "\\'")}', '${pet.breed}', '${pet.date_of_birth}', '${pet.gender}', '${pet.price}', '${pet.vaccinated_status}', '${pet.pet_details.replace(/'/g, "\\'")}', '${pet.category}')" class="py-2 px-6 border-2 hover:border-brandColor text-brandColor hover:bg-brandColor hover:text-white rounded-xl transition-colors duration-500">Detail</button>
          </div>
        `;
        petContainer.appendChild(div);
    });
};



// ------ Fetch all categories ------ //
const fetchAllCategories = async () => {
    const response = await fetch('https://openapi.programming-hero.com/api/peddy/categories');
    const data = await response.json();
    displayAllCategories(data.categories);
};
// ------ Display all categories ------ //
const displayAllCategories = (categories) => {
    const cateContainer = document.getElementById("categories-container");
    cateContainer.innerHTML = ""; // Clear previous categories

    categories.forEach(item => {
        const div = document.createElement("div");
        div.className = "flex justify-center items-center";

        div.innerHTML = `
        <button id="${item.category}" onclick="fetchAllPets('${item.category}'); setActive('${item.category}')" class="category-btn btn font-bold w-full h-full rounded-2xl hover:bg-[#9002f177]">
            <div class="flex justify-center items-center gap-4 p-4">
                <img class="h-10" src="${item.category_icon}" alt="${item.category}">
                <h2 class="text-2xl font-bold">${item.category}</h2>
            </div> 
        </button>`;
        cateContainer.appendChild(div);
    });
};
// ------ Set active category button ------ //
const setActive = (id) => {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('bg-brandColor', 'opacity-80', 'text-white');
    });
    document.getElementById(id).classList.add('bg-brandColor', 'opacity-80', 'text-white');
};



// ------ Fetch and display data ------ //
fetchAllPets();
fetchAllCategories();



// ------ Sort pets by price ------ //
const sortPetsByPrice = () => {
  const sortedPets = [...allPetsData].sort((a, b) => b.price - a.price);
  displayAllPets(sortedPets);
};



// ------ Thumbnail image fetch ----- //
const fetchImage = (image) => {
  const thumbDiv = document.getElementById('thumb-container'); 
  const div= document.createElement("div");
  div.innerHTML = `
          <div>
              <img class="sm:max-h-24 md:max-h-48 xl:max-h-24 w-full object-cover rounded-xl" src="${image}" alt="">
          </div>`;
  thumbDiv.appendChild(div);
};



//-------Show the modal with a window-------//
const showModal = (image, pet_name, breed, date_of_birth, gender, price, vaccinated_status, pet_details, category ) => {
  const modal = document.getElementById('confirmationModal');
  modal.innerHTML = "";
  const div = document.createElement("div");
  div.innerHTML = `
    <div class="bg-white rounded-2xl shadow-lg p-6 max-w-lg w-full">
      <div>
          <img class="md:h-72 w-full object-cover rounded-xl" src="${image}" alt="">
      </div>

      <div> 
          <h2 class="text-2xl font-extrabold my-3">${pet_name}</h2>
      </div>

      <div class="mb-4 p-4 border-b-2">
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-1">
              <li>
              <i class="text-xl mr-3 text-brandColor fa-solid fa-sun"></i> 
              <span class="font-bold">Breed: </span>
              ${(breed === "null" || breed === "undefined" || breed === "") 
                  ? "Not available" 
                  : breed}
              </li>
              <li>
              <i class="text-xl mr-3 text-brandColor fa-solid fa-calendar-days"></i> 
              <span class="font-bold">Birth: </span>
              ${(date_of_birth === "null" || date_of_birth === "undefined" || date_of_birth === "") 
                  ? "Not available" 
                  : date_of_birth}
              </li>
              <li>
              <i class="text-xl mr-3 text-brandColor fa-solid fa-mercury"></i> 
              <span class="font-bold">Gender: </span>
              ${(gender === "null" || gender === "undefined" || gender === "") 
                  ? "Not available" 
                  : gender}
              </li>
              <li>
                <i class="text-xl mr-3 text-brandColor fa-solid fa-solid fa-tags"></i> 
                <span class="font-bold">Price: </span>${(price === "null" || price === "undefined" || price === "") 
                  ? "Not available" 
                  : `${price} $`}
              </li>
              <li>
                <i class="text-xl mr-2 text-brandColor fa-solid fa-solid fa-syringe"></i> 
                <span class="font-bold">Vaccinated: </span>${(vaccinated_status === "null" || vaccinated_status === "undefined" || vaccinated_status === "") 
                  ? "Not available" 
                  : vaccinated_status}
              </li>
              <li>
                <i class="text-xl mr-3 text-brandColor fa-solid fa-layer-group"></i>
                <span class="font-bold">Category: </span>${(category === "null" || category === "undefined" || category === "") 
                  ? "Not available" 
                  : category}
              </li>
          </ul>
      </div>
      <h2 class="text-xl font-bold mb-2">Detail Information:</h2>
      <p>${(pet_details === "null" || pet_details === "undefined" || pet_details === "") 
        ? "Not available" 
        : pet_details}
      </p>
      <button onclick="closeModal()" class="py-3 px-8 mt-6 w-full bg-brandColor text-white rounded-xl opacity-80 hover:opacity-100 transition-opacity duration-500">Close</button>
    </div>
  `;
  modal.appendChild(div);
  modal.style.display = 'flex';
}
//-----Close modal on button click ------//
function closeModal() {
  const modal = document.getElementById('confirmationModal');
  modal.style.display = 'none';
}



//-------- Modal for Adoption done ----------//
function showAdoptModal(button) {
  const modal = document.getElementById('countdownModal');
  modal.innerHTML = "";
  const div = document.createElement("div");
  div.innerHTML = `
      <div class="bg-white p-6 rounded-2xl shadow-lg w-96 text-center flex flex-col justify-center items-center">
          <div>
              <img class="w-24" src="assets/congrates.gif" alt="Description of GIF" />
          </div>
          <h2 class="text-brandColor text-4xl font-extrabold my-4">Congratulations!</h2>
          <p>Adoption process is starting for your Pet</p>
          <p class="text-5xl font-extrabold"><span id="countdown">3</span></p>
      </div>
  `;
  modal.appendChild(div);
  modal.style.display = 'flex';

  button.disabled = true;
  button.textContent = "Adopted";
  button.classList.remove('text-brandColor');
  button.classList.remove('hover:bg-brandColor');
  button.classList.remove('hover:border-brandColor');
  button.classList.remove('hover:text-white');
  button.classList.add('text-gray-500');

  let countdown = 3;
  const countdownElement = document.getElementById('countdown');
  const interval = setInterval(() => {
      countdown -= 1;
      countdownElement.textContent = countdown;

      if (countdown === 0) {
          clearInterval(interval);
          modal.style.display = 'none';
      }
  }, 1000);
}



