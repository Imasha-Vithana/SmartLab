// AUTHENTICATION
if (!requireStudent()) {

    throw new Error(
        "Unauthorized access."
    );

}


const token =
    getToken();


// VARIABLES
let allEquipment = [];



// GET EQUIPMENT
async function loadEquipment() {

    try {

        const response =
            await fetch(
                "https://smartlab-production-5fe7.up.railway.app//api/equipment", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(data.message);

            return;

        }


        allEquipment =
            data.equipment;


        createCategoryOptions();


        displayEquipment(
            allEquipment
        );

    } catch (error) {

        console.error(
            "Equipment loading error:",
            error
        );


        document.getElementById(
            "equipmentContainer"
        ).innerHTML = `

            <p>
                Unable to load equipment.
            </p>

        `;

    }

}


// CREATE CATEGORY OPTIONS
function createCategoryOptions() {

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    const categories = [
        ...new Set(
            allEquipment.map(
                equipment =>
                equipment.category
            )
        )
    ];


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category;


            option.textContent =
                category;


            categoryFilter.appendChild(
                option
            );

        }
    );

}


// DISPLAY EQUIPMENT
function displayEquipment(
    equipmentList
) {

    const container =
        document.getElementById(
            "equipmentContainer"
        );


    container.innerHTML = "";


    if (
        equipmentList.length === 0
    ) {

        container.innerHTML = `

            <div class="no-results">

                <h3>
                    No equipment found
                </h3>

                <p>
                    Try changing your search
                    or filters.
                </p>

            </div>

        `;

        return;

    }


    equipmentList.forEach(
            equipment => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "equipment-card";


                card.innerHTML = `

                <h3>
                    ${equipment.name}
                </h3>


                <p>

                    <strong>
                        Category:
                    </strong>

                    ${equipment.category}

                </p>


                <p>

                    <strong>
                        Description:
                    </strong>

                    ${
                        equipment.description
                        ||
                        "No description available."
                    }

                </p>


                <p>

                    <strong>
                        Quantity:
                    </strong>

                    ${equipment.quantity}

                </p>


                <p>

                    <strong>
                        Location:
                    </strong>

                    ${equipment.location}

                </p>


                <p>

                    <strong>
                        Status:
                    </strong>

                    <span
                        class="status ${equipment.status}"
                    >
                        ${equipment.status}
                    </span>

                </p>


                ${
                    equipment.status === "available"

                    ?

                    `

                    <button
                        onclick="
                            bookEquipment(
                                '${equipment._id}'
                            )
                        "
                    >
                        Book Equipment
                    </button>

                    `

                    :

                    `

                    <button
                        disabled
                    >
                        Not Available
                    </button>

                    `

                }

            `;


            container.appendChild(
                card
            );

        }
    );

}



// FILTER EQUIPMENT
function filterEquipment() {

    const searchValue =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase()
            .trim();


    const categoryValue =
        document
            .getElementById(
                "categoryFilter"
            )
            .value;


    const statusValue =
        document
            .getElementById(
                "statusFilter"
            )
            .value;


    const filteredEquipment =
        allEquipment.filter(
            equipment => {

                const matchesSearch =

                    equipment.name
                        .toLowerCase()
                        .includes(
                            searchValue
                        )

                    ||

                    equipment.category
                        .toLowerCase()
                        .includes(
                            searchValue
                        );


                const matchesCategory =

                    categoryValue === "all"

                    ||

                    equipment.category
                        ===
                        categoryValue;


                const matchesStatus =

                    statusValue === "all"

                    ||

                    equipment.status
                        ===
                        statusValue;


                return (

                    matchesSearch
                    &&
                    matchesCategory
                    &&
                    matchesStatus

                );

            }
        );


    displayEquipment(
        filteredEquipment
    );

}


// SEARCH EVENT
document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        filterEquipment
    );


// CATEGORY EVENT
document
    .getElementById("categoryFilter")
    .addEventListener(
        "change",
        filterEquipment
    );



// STATUS EVENT
document
    .getElementById("statusFilter")
    .addEventListener(
        "change",
        filterEquipment
    );



// CLEAR FILTERS
document
    .getElementById("clearFilters")
    .addEventListener(
        "click",
        () => {

            document.getElementById(
                "searchInput"
            ).value = "";

            document.getElementById(
                "categoryFilter"
            ).value = "all";

            document.getElementById(
                "statusFilter"
            ).value = "all";


            displayEquipment(
                allEquipment
            );

        }
    );



// BOOK EQUIPMENT
function bookEquipment(
    equipmentId
) {

    window.location.href =
        `booking.html?equipment=${equipmentId}`;

}



// LOGOUT
document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        logout
    );


// INITIAL LOAD
loadEquipment();