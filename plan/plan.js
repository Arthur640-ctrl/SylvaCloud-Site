const api = "http://[2a01:cb11:ecc:b300:9dd7:f038:2bc6:b17e]:8000"

fetch(api + "/plans_infos", {
    method: "GET",
    headers: {},
})
    .then(response => response.json())
    .then(response => {
        const data = response
        console.log(data)
        set_disponible(data)
        set_bestseller(data)

    })
    .catch(error => {
        console.error("Erreur lors de l'envoi de la requête : ", error)
        window.location.href = "../error/error.html"
    })

const dispo_free = document.getElementById("dispo_free")
const dispo_essential = document.getElementById("dispo_essential")
const dispo_pro = document.getElementById("dispo_pro")
const dispo_entreprise = document.getElementById("dispo_entreprise")

function set_disponible(data) {
    if (data["plans"]["free"]["indisponible"] == true) {
        dispo_free.style.display = "block"
    } else {
        dispo_free.style.display = "none"
    }

    if (data["plans"]["essential"]["indisponible"] == true) {
        dispo_essential.style.display = "block"
    } else {
        dispo_essential.style.display = "none"
    }

    if (data["plans"]["pro"]["indisponible"] == true) {
        dispo_pro.style.display = "block"
    } else {
        dispo_pro.style.display = "none"
    }

    if (data["plans"]["entreprise"]["indisponible"] == true) {
        dispo_entreprise.style.display = "block"
    } else {
        dispo_entreprise.style.display = "none"
    }
}

const account_type = document.getElementById("account_type")
const account_premium = document.getElementById("account_premium")
const account_type_txt = document.getElementById("account_type_txt")
const account_student = document.getElementById("account_student")

account_student.style.display = "none"

const bestseller_free = document.getElementById("bestseller_free")
const bestseller_essential = document.getElementById("bestseller_essential")
const bestseller_pro = document.getElementById("bestseller_pro")
const bestseller_entreprise = document.getElementById("bestseller_entreprise")

function set_bestseller(data) {
    if (data["plans"]["free"]["bestseller"] == true) {
        bestseller_free.style.display = "block"
    } else {
        bestseller_free.style.display = "none"
    }

    if (data["plans"]["essential"]["bestseller"] == true) {
        bestseller_essential.style.display = "block"
    } else {
        bestseller_essential.style.display = "none"
    }

    if (data["plans"]["pro"]["bestseller"] == true) {
        bestseller_pro.style.display = "block"
    } else {
        bestseller_pro.style.display = "none"
    }

    if (data["plans"]["entreprise"]["bestseller"] == true) {
        bestseller_entreprise.style.display = "block"
    } else {
        bestseller_entreprise.style.display = "none"
    }
}

const account_circle = document.getElementById("account_circle")
const nav_right = document.getElementById("nav-right")

const storedToken = localStorage.getItem("authToken")
const storedEmail = localStorage.getItem("authEmail")

var is_connect = false

const a_my_space = document.getElementById("my_space")

if (storedToken && storedEmail) {
    console.log("Token récupéré : ", storedToken)
    console.log("Email récupéré : ", storedEmail)

    account_circle.style.display = "block"

    nav_right.style.display = "none"

    is_connect = true

    a_my_space.style.display = "block"

} else {
    console.log("Aucun token trouvé.")
    account_circle.style.display = "none"
    a_my_space.style.display = "none"
    account_type.style.display = "none"
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
            console.error("Erreur lors de l'envoi de la requête : ", error)
            window.location.href = "../error/error.html"
        })
})

const free_not_avaible = document.getElementById("free_not_avaible")
const essential_not_avaible = document.getElementById("essential_not_avaible")
const pro_not_avaible = document.getElementById("pro_not_avaible")

const pro_go_workspace = document.getElementById("pro_go_workspace")
const essential_go_workspace = document.getElementById("essential_go_workspace")
const free_go_workspace = document.getElementById("free_go_workspace")

const essential_pay = document.getElementById("essential_pay")
const pro_pay = document.getElementById("pro_pay")

const btn_free_txt = document.getElementById("btn_free_txt")
const btn_essential_txt = document.getElementById("btn_essential_txt")
const btn_pro_txt = document.getElementById("btn_pro_txt")



let plan = ""

function hide_all() {
    free_not_avaible.style.display = "none"
    essential_not_avaible.style.display = "none"
    pro_not_avaible.style.display = "none"

    pro_go_workspace.style.display = "none"
    essential_go_workspace.style.display = "none"
    free_go_workspace.style.display = "none"

    essential_pay.style.display = "none"
    pro_pay.style.display = "none"
}

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
            hide_all()
            

            if (infos_account["plan"] == "free" || infos_account["plan"] == "student") {
                free_go_workspace.style.display = "block"
                btn_free_txt.innerText = "Aller à mon espace"
                essential_pay.style.display = "block"
                pro_pay.style.display = "block"

            } else if (infos_account["plan"] == "essential") {
                btn_free.innerText = "Impossible"
                free_not_avaible.style.display = "block"
                essential_go_workspace.style.display = "block"
                btn_essential_txt.innerText = "Aller à mon espace"
                pro_pay.style.display = "block"
            } else if (infos_account["plan"] == "pro") {
                btn_free_txt.innerText = "Impossible"
                btn_essential_txt.innerText = "Impossible"
                btn_pro_txt.innerText = "Aller à mon espace"

                free_not_avaible.style.display = "block"
                essential_not_avaible.style.display = "block"
                pro_go_workspace.style.display = "block"
                
            }

            if (plan == "free") {
                account_premium.style.display = "none"
                account_type_txt.innerText = "Compte Gratuit"
            } else if (plan == "student") {
                account_student.style.display = "block"
                account_type_txt.innerText = "Compte Etudiant"
                account_premium.style.display = "none"
            } else {
                account_premium.style.display = "block"
                if (plan == "essential") {
                    account_type_txt.innerText = "Compte Essentiel"
                }
                if (plan == "pro") {
                    account_type_txt.innerText = "Compte Pro"
                }
            
            }
        })
        .catch(error => {
            console.error("Erreur lors de l'envoi de la requête : ", error)
        })
}

const btn_free = document.getElementById("btn_free")
const btn_essential = document.getElementById("btn_essential")
const btn_pro = document.getElementById("btn_pro")
const btn_entreprise = document.getElementById("btn_entreprise")

btn_free.addEventListener("click", function() {
    if (is_connect == true) {
        window.location.href = "../workspace/workspace.html"
    } else {
        window.location.href = "../register-login/register-login.html"
    }
})

btn_essential.addEventListener("click", function() {
    if (is_connect == true) {
        if (plan == "free") {
            window.location.href = "../pay/pay.html"
            localStorage.setItem("pay_plan", "essential")
        } else if (plan == "essential") {
            window.location.href = "../workspace/workspace.html"
        } else if (plan == "pro") {
            window.location.href = "../workspace/workspace.html"
        }
    } else {
        window.location.href = "../register-login/register-login.html"
    }
})

btn_pro.addEventListener("click", function() {
    if (is_connect == true) {
        if (plan == "free") {
            window.location.href = "../pay/pay.html"
            localStorage.setItem("pay_plan", "pro")
        } else if (plan == "essential") {
            window.location.href = "../pay/pay.html"
            localStorage.setItem("pay_plan", "pro")
        } else if (plan == "pro") {
            window.location.href = "../workspace/workspace.html"
        }
    } else {
        window.location.href = "../register-login/register-login.html"
    }
})