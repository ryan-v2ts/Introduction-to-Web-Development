const helpOptions = {
    adopt: {
        id: "adopt",
        title: "Adoption may be right for you",
        message: "Give an animal a permanent, loving home. Start by browsing pets and submitting an adoption application."
    },
    foster: {
        id: "foster",
        title: "Fostering may be right for you",
        message: "Provide a safe, temporary home while an animal waits for adoption. Twin Cities Animal Rescue provides guidance and supplies."
    },
    volunteer: {
        id: "volunteer",
        title: "Volunteering may be right for you",
        message: "Share your time through animal care, adoption events, transportation, fundraising, or community outreach."
    }
};

const matcherTimeKey = "matcherTime";
const matcherHomeKey = "matcherHome";
const matcherInvolvementKey = "matcherInvolvement";
const matcherRecommendationKey = "matcherRecommendation";
const fullNameKey = "contactFullName";
const emailKey = "contactEmail";
const interestKey = "contactInterest";
const availabilityKey = "contactAvailability";
const experienceKey = "contactExperience";
const aboutKey = "contactAbout";

function getHelpOption(serviceId) {
    if (serviceId === "adopt") {
        return helpOptions.adopt;
    }
    if (serviceId === "foster") {
        return helpOptions.foster;
    }
    if (serviceId === "volunteer") {
        return helpOptions.volunteer;
    }
    return null;
}

function displayRecommendation(serviceId) {
    const recommendation = getHelpOption(serviceId);
    const result = document.querySelector("#recommendation-result");

    if (!recommendation || !result) {
        return;
    }

    result.querySelector("h3").textContent = recommendation.title;
    result.querySelector("p").textContent = recommendation.message;
    result.hidden = false;
}

function calculateRecommendation(form) {
    const scores = {
        adopt: 0,
        foster: 0,
        volunteer: 0
    };

    const timeAnswer = form.querySelector("input[name='time']:checked");
    const homeAnswer = form.querySelector("input[name='home']:checked");
    const involvementAnswer = form.querySelector("input[name='involvement']:checked");
    let time = "";
    let home = "";
    let involvement = "";

    if (timeAnswer) {
        time = timeAnswer.value;
    }
    if (homeAnswer) {
        home = homeAnswer.value;
    }
    if (involvementAnswer) {
        involvement = involvementAnswer.value;
    }

    if (time === "adopt") {
        scores.adopt += 1;
    } else if (time === "foster") {
        scores.foster += 1;
    } else {
        scores.volunteer += 1;
    }

    if (home === "home") {
        scores.adopt += 1;
        scores.foster += 1;
    } else {
        scores.volunteer += 1;
    }

    if (involvement === "adopt") {
        scores.adopt += 1;
    } else if (involvement === "foster") {
        scores.foster += 1;
    } else {
        scores.volunteer += 1;
    }

    let bestMatch = "volunteer";

    if (scores.adopt > scores.volunteer) {
        bestMatch = "adopt";
    }
    if (scores.foster > scores.adopt && scores.foster > scores.volunteer) {
        bestMatch = "foster";
    }

    return bestMatch;
}

function saveMatcherResults(form, serviceId) {
    const time = form.querySelector("input[name='time']:checked");
    const home = form.querySelector("input[name='home']:checked");
    const involvement = form.querySelector("input[name='involvement']:checked");

    if (time) {
        localStorage.setItem(matcherTimeKey, time.value);
    }
    if (home) {
        localStorage.setItem(matcherHomeKey, home.value);
    }
    if (involvement) {
        localStorage.setItem(matcherInvolvementKey, involvement.value);
    }
    localStorage.setItem(matcherRecommendationKey, serviceId);
}

function restoreMatcherResults(form) {
    const savedTime = localStorage.getItem(matcherTimeKey);
    const savedHome = localStorage.getItem(matcherHomeKey);
    const savedInvolvement = localStorage.getItem(matcherInvolvementKey);
    const savedRecommendation = localStorage.getItem(matcherRecommendationKey);
    const time = form.querySelector("[name='time'][value='" + savedTime + "']");
    const home = form.querySelector("[name='home'][value='" + savedHome + "']");
    const involvement = form.querySelector("[name='involvement'][value='" + savedInvolvement + "']");

    if (time) {
        time.checked = true;
    }
    if (home) {
        home.checked = true;
    }
    if (involvement) {
        involvement.checked = true;
    }

    displayRecommendation(savedRecommendation);
}

function setupServiceMatcher() {
    const form = document.querySelector("#service-matcher-form");

    if (!form) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const recommendation = calculateRecommendation(form);

        saveMatcherResults(form, recommendation);
        displayRecommendation(recommendation);
    });

    const savedRecommendation = localStorage.getItem(matcherRecommendationKey);
    if (savedRecommendation && getHelpOption(savedRecommendation)) {
        restoreMatcherResults(form);
    }
}

function showFieldError(fieldId, errorId, message) {
    const field = document.querySelector("#" + fieldId);
    const error = document.querySelector("#" + errorId);

    if (field) {
        field.setAttribute("aria-invalid", "true");
    }

    if (error) {
        error.textContent = message;
    }
}

function clearFieldErrors(form) {
    document.querySelector("#full-name-error").textContent = "";
    document.querySelector("#email-error").textContent = "";
    document.querySelector("#interest-error").textContent = "";
    document.querySelector("#availability-error").textContent = "";
    document.querySelector("#about-error").textContent = "";

    form.elements.full_name.removeAttribute("aria-invalid");
    form.elements.email.removeAttribute("aria-invalid");
    form.elements.availability.removeAttribute("aria-invalid");
    form.elements.about.removeAttribute("aria-invalid");
}

function validateContactForm(form) {
    clearFieldErrors(form);
    let isValid = true;
    const fullName = form.elements.full_name.value.trim();
    const email = form.elements.email.value.trim();
    const availability = form.elements.availability.value;
    const about = form.elements.about.value.trim();
    const interest = form.querySelector("input[name='interest']:checked");

    if (fullName.length < 2) {
        showFieldError("full_name", "full-name-error", "Please enter your full name.");
        isValid = false;
    }

    if (!email) {
        showFieldError("email", "email-error", "Please enter a valid email address.");
        isValid = false;
    }

    if (!interest) {
        const error = document.querySelector("#interest-error");
        error.textContent = "Please choose how you would like to help.";
        isValid = false;
    }

    if (!availability) {
        showFieldError("availability", "availability-error", "Please choose a date.");
        isValid = false;
    }

    if (about.length < 30) {
        showFieldError("about", "about-error", "Please share at least 30 characters about yourself.");
        isValid = false;
    }

    return isValid;
}

function saveContactForm(form) {
    const selectedInterest = form.querySelector("input[name='interest']:checked");

    localStorage.setItem(fullNameKey, form.elements.full_name.value);
    localStorage.setItem(emailKey, form.elements.email.value);
    localStorage.setItem(availabilityKey, form.elements.availability.value);
    localStorage.setItem(experienceKey, form.elements.experience.value);
    localStorage.setItem(aboutKey, form.elements.about.value);

    if (selectedInterest) {
        localStorage.setItem(interestKey, selectedInterest.value);
    }
}

function restoreContactForm(form) {
    form.elements.full_name.value = localStorage.getItem(fullNameKey) || "";
    form.elements.email.value = localStorage.getItem(emailKey) || "";
    form.elements.availability.value = localStorage.getItem(availabilityKey) || "";
    form.elements.experience.value = localStorage.getItem(experienceKey) || "none";
    form.elements.about.value = localStorage.getItem(aboutKey) || "";

    const savedInterest = localStorage.getItem(interestKey);
    if (savedInterest) {
        const interest = form.querySelector("input[name='interest'][value='" + savedInterest + "']");
        if (interest) {
            interest.checked = true;
        }
    }
}

function setupContactForm() {
    const form = document.querySelector("#contact-form");

    if (!form) {
        return;
    }

    restoreContactForm(form);
    form.addEventListener("input", function () {
        saveContactForm(form);
    });
    form.addEventListener("change", function () {
        saveContactForm(form);
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const status = form.querySelector("#form-status");

        if (validateContactForm(form)) {
            status.textContent = "Thank you. Your information has been sent to our rescue team.";
        } else {
            status.textContent = "Please correct the highlighted fields and try again.";
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    setupServiceMatcher();
    setupContactForm();
});
