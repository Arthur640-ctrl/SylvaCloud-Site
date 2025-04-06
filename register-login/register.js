const api = "http://[2a01:cb11:ecc:b300:9dd7:f038:2bc6:b17e]:8000"

const register_btn = document.getElementById("register_btn") 
const register_error = document.getElementById("register_error")
const register_error_txt = document.getElementById("register_error_txt")

const radioPersonnel = document.getElementById("radio_personnel")
const radioProfessionnel = document.getElementById("radio_professionnel")
const tokenInputContainer = document.getElementById("token_input_container")

function updateInputVisibility() {
    if (radioProfessionnel.checked) {
        tokenInputContainer.style.display = "block"
    } else {
        tokenInputContainer.style.display = "none"
    }
}

register_btn.addEventListener("click", function() {
    const register_email = document.getElementById("register_email").value
    const register_password = document.getElementById("register_password").value
    const register_password_confirm = document.getElementById("register_password_confirm").value

    if (register_email === "") {
        register_error.style.display = "flex"
        register_error_txt.innerText = "Veuillez renseigner une adresse mail valide"
        return
    }

    if (register_password === register_password_confirm) {
        if (!radioPersonnel.checked && !radioProfessionnel.checked) {
            register_error.style.display = "flex"
            register_error_txt.innerText = "Veuillez sélectionner un type d'usage ('Personnel' ou 'Professionnel')"
            return 
        } else {
            if (radioPersonnel.checked) {
                const register_info = {
                    "email": register_email,  
                    "password": register_password,
                    "usage": "personnal",
                    "key": ""
                }
                console.log(register_info)

                fetch(api + "/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(register_info),
                })
                    .then(response => response.text())
                    .then(text => {
                        if (text == "403 Forbidden: Adresse mail invalide !") {
                            register_error.style.display = "flex"
                            register_error_txt.innerText = "Veuillez renseigner une adresse mail valide"
                        }
                        if (text == "403 Forbidden: Mot de passe invalide (le mot de passe doit faire plus de 8 caractères)!") {
                            register_error.style.display = "flex"
                            register_error_txt.innerText = "Le mot de passe doit faire plus de 8 caractères"
                        }
                        if (text == "403 Le mot de passe doit faire moins de 30 caracteres !") {
                            register_error.style.display = "flex"
                            register_error_txt.innerText = "Le mot de passe doit faire moins de 30 caracteres !"
                        }
                        if (text == "403 Forbidden: Un compte personnel existe déjà avec cet email !") {
                            register_error.style.display = "flex"
                            register_error_txt.innerText = "Un compte personnel existe déjà avec cet email !"
                        } else {
                            alert("Vous pouvez vous connecter")
                        }
                        
                        
                    })
                    .catch(error => {
                        console.error("Erreur lors de l'envoi de la requête : ", error);
                        
                    })

            } else if (radioProfessionnel.checked) {
                register_error.style.display = "flex"
                register_error_txt.innerText = "Indisponible pour le moment. Sélectionner 'Personnel'"
            }
        }
        
    } else {
        register_error.style.display = "flex"
        register_error_txt.innerText = "Les mots de passe ne correspondent pas !"
    }
})

radioPersonnel.addEventListener("change", updateInputVisibility)
radioProfessionnel.addEventListener("change", updateInputVisibility)
register_error.style.display = "none"
