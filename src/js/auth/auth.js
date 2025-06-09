
document.querySelector('.login_button').addEventListener('click', () => {
    document.querySelector('#login_popup').style.display = 'block';
});

document.querySelector('#close_login_popup').addEventListener('click', () => {
    document.querySelector('#login_popup').style.display = 'none';
    eraseFields(document.querySelector(".login-form"))
});

document.querySelector('.signup_button').addEventListener('click', () => {
    document.querySelector('#register_popup').style.display = 'block';
    eraseFields(document.querySelector(".register-form"))
});

document.querySelector('#close_register_popup').addEventListener('click', () => {
    document.querySelector('#register_popup').style.display = 'none';
});

document.querySelector('.signup_footer').addEventListener('click', () => {
    document.querySelector('#login_popup').style.display = 'none';
    document.querySelector('#register_popup').style.display = 'block';
});
document.querySelector('.login_footer').addEventListener('click', () => {
    document.querySelector('#register_popup').style.display = 'none';
    document.querySelector('#login_popup').style.display = 'block';
});

function checkYourName(name) {
    if (name.length >= 2 && name.length <= 30 && /^[a-zA-Z -]+$/.test(name))
        return true;
    else return false;
}

function checkAge(age) {
    if (age >= 18 && age <= 130)
        return true;
    else return false;
}

function checkEmail(email) {
    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email))
        return true;
    else return false;
}

function checkYourWebsite(websiteURL) {
    if (websiteURL == "" || /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/.test(websiteURL))
        return true;
    else return false;
}

function checkYourMessage(messageText) {
    if (messageText.length >= 10 && messageText.length <= 350)
        return true;
    else return false;
}

function checkPassword(password) {
    if (password.length >= 8 && password.length <= 30 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/.test(password))
        return true;
    else return false;
}

function checkPhoneNumber(phone) {
    if (/^\+?\d{10,15}$/.test(phone))
        return true;
    else return false;
}

let currentUser;

const passwordHashSalt = "TSDb13xUniq34MqI";

async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

async function verifyPassword(inputPassword, storedHash, storedSalt) {
    const inputHash = await hashPassword(inputPassword, storedSalt);
    return inputHash === storedHash;
}

document.querySelector('.login-form').addEventListener("submit", (e) => {
    e.preventDefault();

    document.querySelectorAll('#fieldError').forEach((el) => el.remove());

    const fields = e.target.querySelectorAll('input');

    let password = localStorage.getItem(fields[0].value);

    async function handlePasswordVerification() {
        if (await verifyPassword(fields[1].value, password, passwordHashSalt)) {
            createErrorElement("Wrong password!", fields[1]);
        }
    }
    handlePasswordVerification();

    if (!checkYourName(fields[0].value))
        createErrorElement("Uncorrect name!", fields[0]);

    else if (password == null) {
        createErrorElement("No such user!", fields[0]);
    }
    else {
        alert("Login successful!");
        currentUser = fields[0].value;
        swapButtonsToUser();
        document.querySelector('#login_popup').style.display = 'none';
    }

});

document.querySelector('.register-form').addEventListener("submit", (e) => {
    document.querySelectorAll('#fieldError').forEach((el) => el.remove());

    e.preventDefault();
    const fields = e.target.querySelectorAll('input');
    let isValid = true;

    if (!checkYourName(fields[0].value)) {
        createErrorElement("Uncorrect name!", fields[0]);
        isValid = false;
    }

    else if (localStorage.getItem(fields[0].value)) {
        createErrorElement("User with such name already exists!", fields[0]);
        isValid = false;
    }

    if (!checkEmail(fields[1].value)) {
        createErrorElement("Uncorrect email!", fields[1]);
        isValid = false;
    }
    if (!checkPassword(fields[2].value)) {
        createErrorElement("Uncorrect password! Password must have from 8 to 30 symbols, and have also uppercase", fields[2]);
        isValid = false;
    }

    if (isValid) {
        (async () => {
            const hashedPassword = await hashPassword(fields[2].value, passwordHashSalt);
            localStorage.setItem(fields[0].value, hashedPassword);
        })();
        currentUser = fields[0].value;
        alert("Registration successful");
        document.querySelector('#register_popup').style.display = 'none';
        swapButtonsToUser();
    }


});

function swapButtonsToUser() {
    document.querySelector('.login_register').style.display = 'none';
    let userBlock = document.createElement("div");
    userBlock.className = "user_block";
    logoutButton = document.createElement("button");
    logoutButton.className = "logout_button transparent_button";
    logoutButton.textContent = "LOGOUT";
    logoutButton.addEventListener("click", () => {
        document.querySelector('.user_container').remove();
        document.querySelector('.login-form').reset();
        document.querySelector('.register-form').reset();
        document.querySelector('.login_register').style.display = 'flex';
        document.querySelector('.login_button').style.display = 'block';
        document.querySelector('.signup_button').style.display = 'block';
        document.querySelector(".shop-icon").style.display = "none";
        currentUser = null;
    });
    let userImage = document.createElement("div");
    userImage.style.backgroundImage = "url('src/img/profile-default.svg')";
    userImage.className = "user_image";
    userImage.alt = "user image";
    userBlock.append(userImage);
    userBlock.append("Hello, " + currentUser);
    userBlock.style.cssText = 'width:200px;white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';

    let userContainer = document.createElement("div");
    userContainer.className = "user_container";
    userContainer.append(userBlock);
    userContainer.append(logoutButton);
    document.querySelector('header').append(userContainer);
    //////////////////////////
    const cart_button = document.querySelector(".shop-icon");
    if (cart_button) cart_button.style.display = "block";
}

function createErrorElement(errorText, errorInputObj) {
    errorInputObj.style.borderColor = "red";

    let div_block = document.createElement("div");
    div_block.id = "fieldError";
    div_block.textContent = "Error: " + errorText;
    errorInputObj.parentNode.insertBefore(div_block, errorInputObj.nextSibling);
    div_block.style.color = "red";
}

document.querySelectorAll('.ask_us_article input, .login-form input, .discuss_form input, .register-form input, .discuss_form textarea').forEach(e => e.addEventListener("focus", focusedInputEvent));

function focusedInputEvent(event) {
    event.currentTarget.style.border = "1px solid #D7DADD";
    let error = event.currentTarget.nextSibling;
    if (error && error.id == "fieldError") error.remove();
}

function eraseFields(formElement) {
    const fields = formElement.querySelectorAll("input:not([type='submit'])");
    fields.forEach(e => {
        e.value = "";
        focusedInputEvent({ currentTarget: e });
    });
}
////////////////ASK_US_QUESTION///////////////////
if (document.querySelector('.send'))
    document.querySelector('.send').addEventListener('submit', (e) => {
        e.preventDefault();
        document.querySelectorAll('#fieldError').forEach((el) => el.remove());

        const fields = e.target.querySelectorAll('input');
        if (!checkYourName(fields[0].value)) {
            createErrorElement("Uncorrect name!", fields[0]);
            isValid = false;
        }
        if (!checkPhoneNumber(fields[1].value)) {
            createErrorElement("Uncorrect phone number!", fields[1]);
            isValid = false;
        }
        if (!checkYourMessage(fields[2].value)) {
            createErrorElement("Message must have lenght from 10 to 350 symbols.", fields[2]);
            isValid = false;
        }

        if (isValid) {
            alert("Message sent successfully!");
        }
    });

////////////////BOTTOM_FORM_REQUEST?//////////////////
if (document.querySelector(".discuss_form"))
    document.querySelector('.discuss_form').addEventListener("submit", (e) => {
        e.preventDefault();
        document.querySelectorAll('#fieldError').forEach((el) => el.remove());

        const fields = e.target.querySelectorAll('input');
        const message = e.target.querySelector('textarea');
        let isValid = true;

        if (!checkYourName(fields[0].value)) {
            createErrorElement("Uncorrect name!", fields[0]);
            isValid = false;
        }
        if (!checkPhoneNumber(fields[1].value)) {
            createErrorElement("Uncorrect phone number!", fields[1]);
            isValid = false;
        }
        if (!checkEmail(fields[2].value)) {
            createErrorElement("Uncorrect email!", fields[2]);
            isValid = false;
        }
        // const agreement_communications = fields[3].value;

        if (!checkYourMessage(message)) {
            createErrorElement("Message must have lenght from 10 to 350 symbols.", message);
            isValid = false;
        }

        if (isValid) {
            alert("Message sent successfully!");
        }
    });


