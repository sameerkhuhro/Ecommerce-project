// Simple localStorage-based auth for demo purposes
(function () {
	"use strict";

	const STORAGE_KEY = "furniro-user";

	function getUser() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			return raw ? JSON.parse(raw) : null;
		} catch (_) {
			return null;
		}
	}

	function saveUser(user) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
	}

	function clearUser() {
		localStorage.removeItem(STORAGE_KEY);
	}

	function setVisible(el, show) {
		if (!el) return;
		el.hidden = !show;
	}

	function init() {
		const loginForm = document.getElementById("loginForm");
		const registerForm = document.getElementById("registerForm");
		const accountInfoCard = document.getElementById("accountInfoCard");
		const loginCard = document.getElementById("loginCard");
		const registerCard = document.getElementById("registerCard");
		const logoutBtn = document.getElementById("logoutBtn");
		const infoName = document.getElementById("infoName");
		const infoEmail = document.getElementById("infoEmail");
		const greeting = document.getElementById("accountGreeting");

		function render() {
			const user = getUser();
			if (user) {
				infoName.textContent = user.name;
				infoEmail.textContent = user.email;
				greeting.textContent = `Welcome back, ${user.name}!`;
			}
			setVisible(accountInfoCard, Boolean(user));
			setVisible(loginCard, !user);
			setVisible(registerCard, !user);
		}

		if (registerForm) {
			registerForm.addEventListener("submit", function (e) {
				e.preventDefault();
				const name = document.getElementById("regName").value.trim();
				const email = document.getElementById("regEmail").value.trim().toLowerCase();
				const password = document.getElementById("regPassword").value;
				if (!name || !email || password.length < 4) return;
				saveUser({ name, email, password });
				render();
			});
		}

		if (loginForm) {
			loginForm.addEventListener("submit", function (e) {
				e.preventDefault();
				const email = document.getElementById("loginEmail").value.trim().toLowerCase();
				const password = document.getElementById("loginPassword").value;
				const stored = getUser();
				if (stored && stored.email === email && stored.password === password) {
					render();
				} else {
					alert("Invalid credentials. Register first or check your password.");
				}
			});
		}

		if (logoutBtn) {
			logoutBtn.addEventListener("click", function () {
				clearUser();
				if (greeting) greeting.textContent = "Manage your profile, login or create an account.";
				render();
			});
		}

		render();
	}

	document.addEventListener("DOMContentLoaded", init);
})(); 


