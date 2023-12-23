async function getRandomDish() {
    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        const data = await response.json();
        displayDish(data.meals[0]);
    } catch (error) {
        console.error("Error fetching random dish:", error);
    }
}

async function searchByCategory() {
    const userInput = document.getElementById("searchInput").value.trim();
    if (!userInput) {
        alert("Please enter a category");
        return;
    }

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${userInput}`);
        const data = await response.json();
        displayCategoryResults(data.meals);
    } catch (error) {
        console.error("Error fetching dishes by category:", error);
    }
}

function displayDish(dish) {
    const resultContainer = document.getElementById("random-result");
    resultContainer.innerHTML = `
        <div class="dish1" onclick="displayDetails('${dish.idMeal}')">
            <h2>${dish.strMeal}</h2>
            <img src="${dish.strMealThumb}" alt="${dish.strMeal}" style="max-width: 100%;">
        </div>
    `;
}

function displayCategoryResults(meals) {
    const resultContainer = document.getElementById("category-result");
    if (meals) {
        resultContainer.innerHTML = meals.map(meal => `
            <div class="dish" onclick="displayDetails('${meal.idMeal}')">
                <h2 class="smaller">${meal.strMeal}</h2>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="max-width: 100%;">
            </div>
        `).join("");
    } else {
        resultContainer.innerHTML = "<p>No results found</p>";
    }
}

async function displayDetails(mealId) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        const meal = data.meals[0];
        openModal(meal);
    } catch (error) {
        console.error("Error fetching dish details:", error);
    }
}

function openModal(meal) {
    const modal = document.getElementById("myModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalContent = document.getElementById("modalContent");

    modalTitle.textContent = meal.strMeal;
    modalContent.innerHTML = `
    <p>Ingredients: ${getIngredients(meal)}</p>
        <p>Instructions: ${meal.strInstructions}</p>`
        

    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}


function getIngredients(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && measure) {
            ingredients.push(`${ingredient} - ${measure}`);
        } else if (ingredient) {
            ingredients.push(ingredient);
        }
    }
    return ingredients.join(", ");
}
var input_tag =document.getElementById("searchInput")
input_tag.addEventListener("keydown",function(event){
    if (event.keyCode === 13) {
        searchByCategory()
        document.getElementById("category-result").scrollIntoView({
            behavior:"smooth"
        })
    }
})


getRandomDish();