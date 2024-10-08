// ------Custom Tailwind CSS------//
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
  }


// ------ fetch all post ------//
const fetchAllPets = async (category) => {
  if(category){
    const fetchPets = fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`);
    try {
      const response = await fetchPets;
      const data = await response.json();
      displayAllPets(data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  else{
    const fetchPets = fetch(`https://openapi.programming-hero.com/api/peddy/pets`);
    try {
      const response = await fetchPets;
      const data = await response.json();
      displayAllPets(data.pets);
    } catch (error) {
      console.error('Error:', error);
    }
  }
};

// ------ Display Post ------//
const displayAllPets = (data) => {
    const petContainer = document.getElementById("pet-container");
    petContainer.innerHTML = "";
    if(data.length === 0){
      petContainer.innerHTML = `
        <div class="grid col-span-1 md:col-span-3 h-full border rounded-2xl min-h-96 justify-center items-center text-center py-20 px-4">
            <div class="container m-auto flex flex-col justify-center items-center max-w-[400px] md:max-w-[600px] text-center">
                <div>
                    <img src="assets/error.webp" alt="">
                </div>
                <h2 class="text-2xl font-extrabold">No Information Available</h2>
                <p class="my-4">There is no information available regarding this topic at the moment. Please check back later for updates.</p
            </div>
        </div>`
      return;
    }
    data.forEach(pet => {
    const div = document.createElement("div");
    div.innerHTML =`  
    <div class="border rounded-2xl p-4">
      <div class="rounded-xl ">
            <img class="md:h-48 w-full object-cover rounded-xl" src="${pet.image}" alt="">
        </div>
        <div> 
            <h2 class="text-2xl font-extrabold my-3">${pet.pet_name}</h2>
        </div>
        <div class="mb-4">
            <ul class="flex flex-col gap-1">
                <li>
                  <i class="text-xl mr-3 text-brandColor fa-solid fa-sun"></i> 
                  <span class="font-bold">Breed: </span>${(pet.breed === null || pet.breed === undefined || pet.breed === "") 
                    ? "Not available" 
                    : pet.breed}
                </li>
                <li>
                  <i class="text-xl mr-3 text-brandColor fa-solid fa-calendar-days"></i> 
                  <span class="font-bold">Birth: </span>${(pet.date_of_birth === null || pet.date_of_birth === undefined || pet.date_of_birth === "") 
                    ? "Not available" 
                    : pet.date_of_birth}
                </li>
                <li>
                  <i class="text-xl mr-3 text-brandColor fa-solid fa-mercury"></i> 
                  <span class="font-bold">Gender: </span>${(pet.gender === null || pet.gender === undefined || pet.gender === "") 
                    ? "Not available" 
                    : pet.gender}
                </li>
                <li>
                  <i class="text-xl mr-3 text-brandColor fa-solid fa-solid fa-tags"></i> 
                  <span class="font-bold">Price: </span>${(pet.price === null || pet.price === undefined || pet.price === "") 
                    ? "Not available" 
                    : `${pet.price} $`}
                </li>
            </ul>
        </div>

        <div class="flex justify-between pt-4 border-t">
            <button onclick=fetchImage('${pet.image}') class="py-2 px-4 border-2 hover:border-brandColor text-brandColor hover:bg-brandColor hover:text-white rounded-xl transition-colors duration-500"><i class="fa-regular fa-thumbs-up"></i></button>

            <button onclick="showAdoptModal()" class="py-2 px-6 border-2 hover:border-brandColor text-brandColor hover:bg-brandColor hover:text-white rounded-xl transition-colors duration-500">Adopt</button>

            <button onclick=showModal() class="py-2 px-6 border-2 hover:border-brandColor text-brandColor hover:bg-brandColor hover:text-white rounded-xl transition-colors duration-500">Detail</button>
        </div>
      </div>
     `
    petContainer.appendChild(div);
  })
}
fetchAllPets();


// ------ fetch all Categories ------//
const fetchAllCategories = async () => {
    const response = await fetch('https://openapi.programming-hero.com/api/peddy/categories');
    const data = await response.json();
    displayAllCategories(data.categories);
};
// ------ Display all Categories ------//
const displayAllCategories = (categories) => {
  const cateContainer = document.getElementById("categories-container");
  categories.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML =` 
    <div class="flex justify-center items-center">
    <button id="${item.category}" onclick="fetchAllPets('${item.category}'); setActive('${item.category}')" class="category-btn btn font-bold w-full h-full rounded-2xl hover:bg-[#9002f177]">
      <div class="flex justify-center items-center gap-4 p-4 ">
        <img class="h-10" src="${item.category_icon}" alt="">
        <h2 class="text-2xl font-bold">${item.category}</h2>
      </div> 
    </button>
    </div>
     `
    cateContainer.appendChild(div);
  })
}
fetchAllCategories();


// ------Switching Categories Menu with active status-----//
const setActive = (id) => {
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('bg-brandColor', 'opacity-80', 'text-white');
  });
  document.getElementById(id).classList.add('bg-brandColor', 'opacity-80', 'text-white');
};


// ------thumbnail fetch-----//
const fetchImage = (image) => {
  console.log(image);
  const thumbDiv = document.getElementById('thumb-container'); 
  const div= document.createElement("div");
  div.innerHTML = `
            <div>
                <img class="sm:max-h-24 md:max-h-48 xl:max-h-24 w-full object-cover rounded-xl" src="${image}" alt="">
            </div>
  `
  thumbDiv.appendChild(div);
}



//-------Show the modal with window-------//
function showModal(message) {

  const modal = document.getElementById('confirmationModal');
  const modalMessage = document.getElementById('modalMessage');
  modalMessage.innerText = message;
  modal.style.display = 'flex';
}
//------Close the modal window-------//
function closeModal() {
  const modal = document.getElementById('confirmationModal');
  modal.style.display = 'none';
}


//-------- Modal for Adopt done ----------//
function showAdoptModal(message) {
  const modal = document.getElementById('countdownModal');
  const countdownElement = document.getElementById('countdown');
  modalMessage.innerText = message;
  modal.style.display = 'flex';

  let countdown = 3;
  countdownElement.textContent = countdown;
  
  const interval = setInterval(() => {
      countdown -= 1;
      countdownElement.textContent = countdown;
      
      if (countdown === 0) {
          clearInterval(interval);
          modal.style.display = 'none';
      }
  }, 1000);
}
