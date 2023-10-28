
function validateForm() {

    let x = document.forms["addnew"];

    if (x["first_name"].value == "") {
        alert("First name must be filled out");
        return false;
    };

    if (x["last_name"].value == "") {
        alert("Last Name must be filled out");
        return false;
    };

    if (x["age"].value == "") {
        alert("Age must be filled out");
        return false;
    }
};