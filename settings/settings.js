const api = "http://[2a01:cb11:ecc:b300:9dd7:f038:2bc6:b17e]:8000"

const storedToken = localStorage.getItem("authToken")
const storedEmail = localStorage.getItem("authEmail")

var is_connect = false

const value_email = document.getElementById("value_email")
const value_name = document.getElementById("value_name")
const value_family_name = document.getElementById("value_family_name")
const value_accountid = document.getElementById("value_accountid")

if (storedToken && storedEmail) {
    console.log("Token récupéré : ", storedToken)
    console.log("Email récupéré : ", storedEmail)

    load_settings(storedEmail, storedToken)

    is_connect = true


} else {
    console.log("Aucun token trouvé.")
    window.location.href = "../index.html"
}

function load_settings(email, token) {
    const infos = {
        "token": token,
        "email": email
    }
    
    fetch(api + "/get_settings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(infos),
    })
        .then(response => response.json())
        .then(response => {
            console.log(response)
            set_settings(response)
        })
        .catch(error => {
            console.error("Erreur lors de l'envoi de la requête : ", error)
        })
}

function set_settings(data) {
    value_email.innerText = data["email"]
    value_name.value = data["name"]
    value_family_name.value = data["family_name"]
    value_accountid.innerText = data["id"]
}

function modify_setting(setting, new_value) {
    const modify_infos = {
        "token": storedToken,
        "email": storedEmail,
        "setting": setting,
        "new_value": new_value
    }
    
    fetch(api + "/modify_setting", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(modify_infos),
    })
        .then(response => response.json())
        .then(response => {
            set_settings(response)
        })
        .catch(error => {
            console.error("Erreur lors de l'envoi de la requête : ", error)
        })
}

value_name.addEventListener("change", function() {
    modify_setting("infos.name", value_name.value)
})

value_family_name.addEventListener("change", function() {
    modify_setting("infos.family_name", value_family_name.value)
})
