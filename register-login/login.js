const login_btn = document.getElementById("login_btn")

const login_error = document.getElementById("login_error")
const login_error_txt = document.getElementById("login_error_txt")

login_btn.addEventListener("click", function() {
    const login_email = document.getElementById("login_email").value
    const login_password = document.getElementById("login_password").value

    if (login_email === "") {
        login_error.style.display = "flex"
        login_error_txt.innerText = "Veuillez renseigner une adresse mail valide"
        return
    }
    if (login_password === "") {
        login_error.style.display = "flex"
        login_error_txt.innerText = "Veuillez renseigner une mot de passe valide"  
        return 
    }
    const login_info = {
        "email": login_email,
        "password": login_password
    }
    fetch(api + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(login_info),
    })
        .then(response => response.text())
        .then(text => {
            
            if (text == "401 Mot de passe incorrect") {
                login_error.style.display = "flex"
                login_error_txt.innerText = "Mot de passe incorrect"  
            }
            if (text == "404 Utilisateur non trouvé") {
                login_error.style.display = "flex"
                login_error_txt.innerText = "Compte inexistant"  
            }
            if (text == "403 Forbidden: Compte déjà connecté !") {
                login_error.style.display = "flex"
                login_error_txt.innerText = "Compte déjà connecté !"  
            } 
            
            const regex = /Connexion réussie : (\S+)/
            const match = text.match(regex)

            if (match) {
                const token = match[1]
                console.log("Token récupéré :", token)
                localStorage.setItem("authToken", token)
                localStorage.setItem("authEmail", login_email)
                window.location.href = "../index.html"
            }
        })
        .catch(error => {
            console.error("Erreur lors de l'envoi de la requête : ", error)
            window.location.href = "../error/error.html"
        })
})

login_error.style.display = "none"