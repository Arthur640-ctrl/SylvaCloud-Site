const api = "http://[2a01:cb11:ecc:b300:9dd7:f038:2bc6:b17e]:8000"

const storedEmail = localStorage.getItem("adminEmail")
const storedToken = localStorage.getItem("adminToken")


if(storedToken && storedEmail) {
    const check = {
        "token": storedToken,
    }

    fetch(api + "/admin/check", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(check),
    })
        .then(response => response.text())
        .then(text => {
            if (text === "200") {
                console.log("Admin is connected")
            }
            else {
                window.location.href = "/index.html"
            }

        })
        .catch(error => {
            console.error("Erreur lors de l'envoi de la requête : ", error);
            window.location.href = "/error/error.html"
        })
} else {
    window.location.href = "/error/error.html"
}