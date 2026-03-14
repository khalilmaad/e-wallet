import {finduserbymail} from "../models/database.js";

const submitButton = document.getElementById('submitbtn');

submitButton.addEventListener('click', handlerlogin);

function handlerlogin()
{
    submitButton.textContent = "Loading...";

    setTimeout(() => {
        
        const emailInput = document.getElementById('mail');
        const passwordInput = document.getElementById('password');

        const email = emailInput.value;
        const password = passwordInput.value;

        const user = finduserbymail(email,password);
        
        if(user)
        {   
            sessionStorage.setItem("user", JSON.stringify(user));
            document.location='../views/dashboard.html';
        }
        else
        {
            alert("bad credentials");
            submitButton.textContent = "Se connecter";
        }
    }, 2000);

}