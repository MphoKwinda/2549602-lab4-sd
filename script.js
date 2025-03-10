const input = document.getElementById("countryInput");
const button = document.getElementById("searchButton");
const countryInfo = document.getElementById("countryInfo");
const borderingCountries = document.getElementById("borderingCountries");

async function fetchCountryData() {
    let countryName = input.value.trim();
    if (countryName === "") {
        alert("Please enter a country name.");
        return;
    }

    try {
        let response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) throw new Error("Country input is not found.");
        let data = await response.json();
        let country = data[0];

        let capital = country.capital ? country.capital[0] : "No such capital exist";
        let population = country.population.toLocaleString();
        let region = country.region;
        let flag = country.flags.png;
        let borders = country.borders || [];

        // Display main country details
        countryInfo.innerHTML = `
            <section>
                <h2>${country.name.common}</h2>
                <p><strong>Capital:</strong> ${capital}</p>
                <p><strong>Population:</strong> ${population}</p>
                <p><strong>Region:</strong> ${region}</p>
                <img src="${flag}" alt="Flag of ${country.name.common}" width="150">
            </section>
        `;

        // Fetch bordering countries
        if (borders.length > 0) {
            let borderRequests = borders.map(border => 
                fetch(`https://restcountries.com/v3.1/alpha/${border}`).then(res => res.json())
            );
            let borderData = await Promise.all(borderRequests);

            borderingCountries.innerHTML = "<h3>Bordering Countries:</h3>";
            borderData.forEach(data => {
                let borderCountry = data[0];
                borderingCountries.innerHTML += `
                    <section>
                        <p>${borderCountry.name.common}</p>
                        <img src="${borderCountry.flags.png}" alt="Flag of ${borderCountry.name.common}" width="100">
                    </section>
                `;
            });
        } else {
            borderingCountries.innerHTML = "<p>No bordering countries.</p>";
        }
    } catch (error) {
        countryInfo.innerHTML = `<p style="color:red;">${error.message}</p>`;
        borderingCountries.innerHTML = "";
    }
}

button.addEventListener("click", fetchCountryData);
