(function () {
    // URL de l'API REST de WordPress
    let bouton__pays = document.querySelectorAll(".bouton__pays");
    let url;
    for (const elm of bouton__pays) {
        elm.addEventListener("mousedown", function (e) {
            //on effectue un search à l'aide du mot du bouton à travers tous les articles et on affiche les articles qui contiennent le mot

            let pays = document.querySelectorAll(".bouton__pays");
            for (const elm of pays) {
                elm.classList.remove("bouton__pays__actif");
            }
            elm.classList.add("bouton__pays__actif");
            pays = e.target.id;

            url = `https://gftnth00.mywhc.ca/tim41/wp-json/wp/v2/posts?search=${pays}&_fields=link,title,featured_media,_links,_embedded,content,categories,terms&_embed
            `;
            console.log(url);
            fetchUrl(url);
        });
    }

    //À la base, on sélectionne le bouton france
    url = `https://gftnth00.mywhc.ca/tim41/wp-json/wp/v2/posts?search=france&_fields=link,title,featured_media,_links,_embedded,content,categories,terms&_embed
    `;
    fetchUrl(url);
    let bouton__france = document.getElementById("France");
    bouton__france.classList.add("bouton__pays__actif");

    // Effectuer la requête HTTP en utilisant fetch()
    function fetchUrl(url) {
        fetch(url)
            .then(function (response) {
                // Vérifier si la réponse est OK (statut HTTP 200)
                if (!response.ok) {
                    throw new Error("La requête a échoué avec le statut " + response.status);
                }

                // Analyser la réponse JSON
                return response.json();
                console.log(response.json());
            })
            .then(function (data) {
                // La variable "data" contient la réponse JSON
                console.log(data);

                // Triez les données par titre en ordre alphabétique
                data.sort(function (a, b) {
                    return a.title.rendered.localeCompare(b.title.rendered);
                });

                let conteneut__pays = document.querySelector(".contenu__pays");
                conteneut__pays.innerHTML = "";

                // Maintenant, vous pouvez traiter les données comme vous le souhaitez
                // Par exemple, extraire les titres des articles comme dans l'exemple précédent
                data.forEach(function (article) {
                    let titre = article.title.rendered;

                    let categories = article.categories;
                    let liens_cat = `https://gftnth00.mywhc.ca/tim41/category/${categories}`;

                    let lien = article.link;

                    let contenu = article.content.rendered;
                    // afficher les 50 premiers mots
                    contenu = contenu.split(" ").slice(0, 50).join(" ") + "...";

                    let carte = document.createElement("div");
                    carte.classList.add("pays__carte");
                    carte.classList.add("carte");

                    let image;
                    if (article._embedded["wp:featuredmedia"]) {
                        image = article._embedded["wp:featuredmedia"][0].media_details.sizes.medium.source_url;
                    } else {
                        image = "https://via.placeholder.com/150";
                    }

                    carte.innerHTML = `
                    <a href="${lien}">
                    <h4>${titre}</h4> 
                    </a>
                    <ul class="post-categories"></ul>
                    <div class="pays__contenu">
                    <img src="${image}" alt="${titre}">
                    <p>${contenu}</p>
                    </div>
                    `;

                    conteneut__pays.appendChild(carte);

                    let cat_actuelle = 0;
                    categories.forEach((cat) => {
                        let liste = document.getElementsByClassName("post-categories");
                        let elm_cat = document.createElement("li");
                        let nom_cat = article._embedded["wp:term"][0][cat_actuelle].name;
                        cat_actuelle++;
                        elm_cat.innerHTML = `<a href="https://gftnth00.mywhc.ca/tim41/category/${cat}">${nom_cat}</a>`;
                        liste[liste.length - 1].appendChild(elm_cat);
                    });
                });
            })
            .catch(function (error) {
                // Gérer les erreurs
                console.error("Erreur lors de la récupération des données :", error);
            });
    }
})();
