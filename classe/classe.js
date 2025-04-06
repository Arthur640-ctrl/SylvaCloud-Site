const account_circle = document.getElementById("account_circle")
const nav_right = document.getElementById("nav-right")

const storedToken = localStorage.getItem("authToken")
const storedEmail = localStorage.getItem("authEmail")

const a_my_space = document.getElementById("my_space")

a_my_space.style.display = "none"
account_circle.style.display = "none"
nav_right.style.display = "block"

const api = "http://[2a01:cb11:ecc:b300:9dd7:f038:2bc6:b17e]:8000"

var is_connect = false

if (storedToken && storedEmail) {
    console.log("Token récupéré : ", storedToken)
    console.log("Email récupéré : ", storedEmail)

    account_circle.style.display = "block"
    nav_right.style.display = "none"

    is_connect = true

    start_btn.innerHTML = `
    Aller à mon espace
    <i class="fa-solid fa-arrow-right start-for-free-btn-arrow"></i>
    `
    a_my_space.style.display = "block"

} else {
    console.log("Aucun token trouvé.")
}

const logout_btn = document.getElementById("logout")

logout_btn.addEventListener("click", function() {

    const logout_info = {
        "token": storedToken,
        "email": storedEmail
    }

    fetch(api + "/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(logout_info),
    })
        .then(response => response.text())
        .then(text => {
            if (text == "200 Déconnexion réussie") {
                localStorage.clear();
                is_connect = false
                location.reload(true);
            } else {
                window.location.href = "../error/error.html"
            }
        })
        .catch(error => {
            console.error("Erreur lors de l'envoi de la requête : ", error);
            window.location.href = "../error/error.html"
        })
})



const account_type = document.getElementById("account_type")
const account_premium = document.getElementById("account_premium")
const account_type_txt = document.getElementById("account_type_txt")
const account_student = document.getElementById("account_student")

account_student.style.display = "none"


if (is_connect == true) {
    const get_infos = {
        "email": storedEmail,
        "token": storedToken
    }
    
    fetch(api + "/get_infos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(get_infos),
    })
        .then(response => response.json())
        .then(response => {
            const infos_account = response
            plan = infos_account["plan"]

            if (plan == "free") {
                account_premium.style.display = "none"
                account_type_txt.innerText = "Compte Gratuit"
            } else {
                account_premium.style.display = "block"
                if (plan == "essential") {
                    account_type_txt.innerText = "Compte Essentiel"
                }
                if (plan == "pro") {
                    account_type_txt.innerText = "Compte Pro"
                }
            }

            if (plan == "student") {
                account_student.style.display = "block"
                account_type_txt.innerText = "Compte Etudiant"
                account_premium.style.display = "none"
            }

        })
        .catch(error => {
            console.error("Erreur lors de l'envoi de la requête : ", error)
        })
} else {
    account_type.style.display = "none"
    account_premium.style.display = "none"
}