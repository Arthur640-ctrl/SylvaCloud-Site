const api = "http://[2a01:cb11:ecc:b300:9dd7:f038:2bc6:b17e]:8000"


const withCodeRadio = document.querySelector('.with-code input')
const withoutCodeRadio = document.querySelector('.without-code input')

const optionCodeDiv = document.querySelector('.option-code')
const optionWithoutCodeDiv = document.querySelector('.option-without-code')

const command = document.getElementById('command')

const storedToken = localStorage.getItem("authToken")
const storedEmail = localStorage.getItem("authEmail")
const storedPlan = localStorage.getItem("pay_plan")

var pay_method = ""

const title = document.getElementById('title')

if (storedPlan == "free") {
    window.location.href = "../plan/plan.html"
} else if (storedPlan == "essential") {
    title.innerText = `Payement pour le plan Essentiel`
} else if (storedPlan == "pro") {
    title.innerText = `Payement pour le plan Pro`
}


const error = document.getElementById('error')
const error_msg = document.getElementById('error-msg')
error.style.display = 'none'


withCodeRadio.addEventListener('change', function() {
    if (withCodeRadio.checked) {
        optionCodeDiv.style.display = 'block'
        optionWithoutCodeDiv.style.display = 'none'
        withoutCodeRadio.checked = false
        pay_method = "code"
        console.log(pay_method)
    }
});

withoutCodeRadio.addEventListener('change', function() {
    if (withoutCodeRadio.checked) {
        
        optionCodeDiv.style.display = 'none'
        optionWithoutCodeDiv.style.display = 'block'
        withCodeRadio.checked = false
        pay_method = "card"
        console.log(pay_method)
    }
});

optionCodeDiv.style.display = 'none'
optionWithoutCodeDiv.style.display = 'none'

if (storedEmail && storedToken) {
    console.log("Token récupéré : ", storedToken)
    console.log("Email récupéré : ", storedEmail)
} else {
    window.location.href = "../register-login/register-login.html"
}

command.addEventListener('click', function() {
    if (pay_method == "card") {
        error.style.display = 'flex'
        error_msg.innerText = "Le paiement par carte n'est pas encore disponible."
    } else if (pay_method == "code") {
        const code = document.getElementById('code-input').value
        if (code.length == 0) {
            error.style.display = 'flex'
            error_msg.innerText = "Veuillez renseigner un code."
        }

        const payement_info = {
            "email": storedEmail,
            "token": storedToken,
            "code": code,
            "plan": storedPlan,
            "type": "code"
        }

        fetch(api + "/pay_plan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payement_info),
        })
            .then(response => response.text())
            .then(response => {
                if (response == "403 : Code déjà utilisé") {
                    error.style.display = 'flex'
                    error_msg.innerText = "Code déjà utilisé."
                } else if (response == "403 : Plan invalide") {
                    error.style.display = 'flex'
                    error_msg.innerText = "Plan invalide."
                    window.location.href = "../plan/plan.html"
                } else if (response == "403 : Espace insuffisant") {
                    window.location.href = "../error/error.html"
                } else if (response == "403 : Code invalide") {
                    error.style.display = 'flex'
                    error_msg.innerText = "Code invalide."
                } else {
                    localStorage.removeItem("pay_plan")
                    window.location.href = "../workspace/workspace.html"
                }
            })
            .catch(error => {
                console.error("Erreur lors de l'envoi de la requête : ", error);
                window.location.href = "../error/error.html"
            })
    }
})