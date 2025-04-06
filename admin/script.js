const api = "http://[2a01:cb11:ecc:b300:9dd7:f038:2bc6:b17e]:8000"

const email = document.getElementById('email')
const password = document.getElementById('password')
const login = document.getElementById('login')

login.addEventListener("click", function() {
    if(email.value && password.value) {
        const login = {
            "password": password.value,
            "email": email.value
        }
    
        fetch(api + "/admin/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(login),
        })
            .then(response => response.text())
            .then(text => {
                console.log(text)

                if (text === "401 Unauthorized") {
                    alert("Wrong email or password")
                } else {
                    const token = text
                    localStorage.setItem("adminEmail", email.value)
                    localStorage.setItem("adminToken", text)
                    window.location.href = "admin.html"
                }
            })
            .catch(error => {
                console.error("Erreur lors de l'envoi de la requête : ", error);
                window.location.href = "../error/error.html"
            })
    } else {
        alert("You need to put a password and email")
    }
})