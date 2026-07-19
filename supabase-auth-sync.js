// Supabase Auth and User Profile Synchronization for ServeArt

// Helper for saving callback of action that triggered auth modal
window.authSuccessCallback = null;

// Password validation function helper
window.validatePassword = function(password) {
    return {
        minLength: password.length >= 8,
        hasUpper: /[A-Z]/.test(password),
        hasLower: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
};

// Check password validity
window.isPasswordValid = function(password) {
    const checks = window.validatePassword(password);
    return checks.minLength && checks.hasUpper && checks.hasLower && checks.hasNumber && checks.hasSpecial;
};

// Open the auth modal and save the callback to run on success
window.showAuthModal = function(callback = null) {
    window.authSuccessCallback = callback;
    const modal = document.getElementById('modal-auth');
    if (modal) {
        modal.classList.remove('hidden');
        window.switchAuthView('login');
    }
};

// Close the auth modal and clear success callback
window.closeAuthModal = function() {
    const modal = document.getElementById('modal-auth');
    if (modal) {
        modal.classList.add('hidden');
    }
    window.authSuccessCallback = null;
};

// Switch between 'login' and 'register' views inside the auth modal
window.switchAuthView = function(view) {
    const loginSection = document.getElementById('auth-login-section');
    const registerSection = document.getElementById('auth-register-section');
    const modalTitle = document.getElementById('auth-modal-title');

    if (!loginSection || !registerSection || !modalTitle) return;

    // Clear messages and inputs
    const errorMsg = document.getElementById('auth-error-msg');
    const successMsg = document.getElementById('auth-success-msg');
    if (errorMsg) {
        errorMsg.innerText = '';
        errorMsg.classList.add('hidden');
    }
    if (successMsg) {
        successMsg.innerText = '';
        successMsg.classList.add('hidden');
    }

    if (view === 'login') {
        loginSection.classList.remove('hidden');
        registerSection.classList.add('hidden');
        modalTitle.innerText = 'Zaloguj się';
    } else {
        loginSection.classList.add('hidden');
        registerSection.classList.remove('hidden');
        modalTitle.innerText = 'Stwórz konto';
        
        // Reset password checklist UI
        window.updatePasswordChecklist('');
    }
};

// Update register password validation indicators
window.updatePasswordChecklist = function(password) {
    const checks = window.validatePassword(password);
    
    const elements = {
        'pwd-check-length': checks.minLength,
        'pwd-check-upper': checks.hasUpper,
        'pwd-check-lower': checks.hasLower,
        'pwd-check-number': checks.hasNumber,
        'pwd-check-special': checks.hasSpecial
    };

    for (const [id, isValid] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) {
            const icon = el.querySelector('.material-symbols-outlined');
            if (isValid) {
                el.classList.remove('text-outline');
                el.classList.add('text-primary');
                if (icon) icon.innerText = 'check_circle';
            } else {
                el.classList.remove('text-primary');
                el.classList.add('text-outline');
                if (icon) icon.innerText = 'radio_button_unchecked';
            }
        }
    }
};

// Guard action: if user logged in -> run callback; if not -> show modal
window.requireAuth = function(actionCallback) {
    if (!window.supabaseClient) {
        // Fallback offline mode - always authenticated
        return true;
    }
    if (STATE.isAuthenticated) {
        return true;
    } else {
        window.showAuthModal(actionCallback);
        return false;
    }
};

// 1. Sign Up implementation with strict requirements
window.supabaseSignUp = async function(email, password, confirmPassword, fullName, role) {
    const errorMsg = document.getElementById('auth-error-msg');
    const successMsg = document.getElementById('auth-success-msg');
    
    if (errorMsg) errorMsg.classList.add('hidden');
    if (successMsg) successMsg.classList.add('hidden');

    try {
        if (!email || !password || !confirmPassword || !fullName || !role) {
            throw new Error("Wszystkie pola są wymagane.");
        }

        const usernameClean = fullName.trim();
        if (usernameClean.length < 3 || usernameClean.length > 15) {
            throw new Error("Nazwa użytkownika musi mieć od 3 do 15 znaków.");
        }

        // Validate password strength
        if (!window.isPasswordValid(password)) {
            throw new Error("Hasło nie spełnia wymagań bezpieczeństwa.");
        }

        // Validate confirm password
        if (password !== confirmPassword) {
            throw new Error("Hasła nie są identyczne.");
        }

        if (!window.supabaseClient) {
            throw new Error("Klient Supabase nie jest skonfigurowany.");
        }

        // Check if username is taken in profiles table
        const { data: existingName, error: checkError } = await window.supabaseClient
            .from('profiles')
            .select('name')
            .eq('name', fullName.trim())
            .maybeSingle();

        if (checkError) {
            console.error("Checking name error:", checkError);
        }

        if (existingName) {
            throw new Error("Ta nazwa użytkownika jest już zajęta.");
        }

        // Perform Supabase Auth registration
        const { data, error: signUpError } = await window.supabaseClient.auth.signUp({
            email: email.trim(),
            password: password,
            options: {
                data: {
                    full_name: fullName.trim(),
                    role: role
                }
            }
        });

        if (signUpError) throw signUpError;

        if (data.user) {
            // Create user profile row
            const joinedDate = new Date().toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' });
            const capitalizedJoined = joinedDate.charAt(0).toUpperCase() + joinedDate.slice(1);

            const { error: profileError } = await window.supabaseClient
                .from('profiles')
                .insert({
                    id: data.user.id,
                    name: fullName.trim(),
                    role: role,
                    city: 'Wrocław',
                    bio: role === 'twórca' ? 'Artysta / Rzemieślnik w ServeArt' : 'Miłośnik polskiego rzemiosła i handmade.',
                    tags: role === 'twórca' ? ['Rękodzieło'] : ['Kolekcja'],
                    joined: capitalizedJoined,
                    exclusions: role === 'twórca' ? 'Dropshippingu, masowej produkcji.' : 'Brak',
                    banner: 'gradient-5'
                });

            if (profileError) {
                console.error("Profile creation error:", profileError);
                // Non-blocking for the auth signup user view, but good to know
            }

            if (successMsg) {
                successMsg.innerText = "Rejestracja pomyślna! Sprawdź swoją skrzynkę e-mail i kliknij link weryfikacyjny przed zalogowaniem.";
                successMsg.classList.remove('hidden');
            }

            // Clear inputs
            document.getElementById('reg-email').value = '';
            document.getElementById('reg-password').value = '';
            document.getElementById('reg-confirm-password').value = '';
            document.getElementById('reg-fullname').value = '';
            
            // Switch to login after a few seconds
            setTimeout(() => {
                window.switchAuthView('login');
            }, 6000);
        }
    } catch (err) {
        if (errorMsg) {
            errorMsg.innerText = err.message || "Błąd podczas rejestracji.";
            errorMsg.classList.remove('hidden');
        }
    }
};

// 2. Sign In implementation
window.supabaseSignIn = async function(email, password) {
    const errorMsg = document.getElementById('auth-error-msg');
    if (errorMsg) errorMsg.classList.add('hidden');

    try {
        if (!email || !password) {
            throw new Error("E-mail oraz hasło są wymagane.");
        }

        if (!window.supabaseClient) {
            throw new Error("Klient Supabase nie jest skonfigurowany.");
        }

        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email.trim(),
            password: password
        });

        if (error) throw error;

        // Listener will take care of session state
    } catch (err) {
        if (errorMsg) {
            errorMsg.innerText = err.message || "Błąd logowania. Sprawdź poprawność danych.";
            errorMsg.classList.remove('hidden');
        }
    }
};

// 3. Sign Out implementation
window.supabaseSignOut = async function() {
    // Show logout overlay modal
    const logoutModal = document.getElementById('modal-logout');
    if (logoutModal) {
        logoutModal.classList.remove('hidden');
    }

    // Clear cached credentials first to ensure they are removed immediately
    safeLocalStorage.removeItem('serveart_user_name');
    safeLocalStorage.removeItem('serveart_user_role');
    safeLocalStorage.removeItem('serveart_user_email');
    safeLocalStorage.removeItem('serveart_user_password');
    safeLocalStorage.removeItem('serveart_premium');
    safeLocalStorage.removeItem('serveart_avatar_shape');
    safeLocalStorage.removeItem('serveart_main_specialization');
    safeLocalStorage.removeItem('serveart_user_avatar');
    safeLocalStorage.removeItem('serveart_user_city');
    safeLocalStorage.removeItem('serveart_user_joined');
    safeLocalStorage.removeItem('serveart_user_profession');
    safeLocalStorage.removeItem('serveart_user_bio');
    safeLocalStorage.removeItem('serveart_user_exclusions');
    safeLocalStorage.removeItem('serveart_user_tags');
    safeLocalStorage.removeItem('serveart_user_customMinBudget');
    safeLocalStorage.removeItem('serveart_user_customMaxBudget');
    safeLocalStorage.removeItem('serveart_user_customDeliveryTime');
    safeLocalStorage.removeItem('serveart_user_banner');
    safeLocalStorage.removeItem('serveart_user_sought_professions');
    safeLocalStorage.removeItem('serveart_user_offering');
    safeLocalStorage.removeItem('serveart_user_cooperationEnabled');
    safeLocalStorage.removeItem('serveart_user_id');

    if (window.showToast) {
        window.showToast("Wylogowano pomyślnie!");
    }

    if (!window.supabaseClient) {
        setTimeout(() => {
            window.location.reload();
        }, 800);
        return;
    }

    try {
        await window.supabaseClient.auth.signOut();
    } catch (err) {
        console.error("SignOut error:", err);
    }

    setTimeout(() => {
        window.location.reload();
    }, 800);
};

// Helper to update the header authentication button dynamically
window.updateHeaderAuthButton = function() {
    const btn = document.getElementById('header-logout-btn');
    if (!btn) return;
    
    // Check if user is logged in
    const isLoggedIn = STATE.isAuthenticated && STATE.currentUser && STATE.currentUser.name !== "Gość";
    
    if (isLoggedIn) {
        // Show logout button (reddish/default styling)
        btn.className = "w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-500/5 text-red-500/80 hover:text-red-600 active:scale-95 transition-transform";
        btn.setAttribute('onclick', 'supabaseSignOut()');
        btn.setAttribute('title', 'Wyloguj się');
        btn.innerHTML = `<span class="material-symbols-outlined">logout</span>`;
    } else {
        // Show login button (textual primary button)
        btn.className = "px-4 h-9 rounded-xl bg-gradient-to-r from-primary to-turquoise text-white font-bold text-xs hover:opacity-95 active:scale-95 transition-transform flex items-center justify-center shadow-sm";
        btn.setAttribute('onclick', 'showAuthModal()');
        btn.setAttribute('title', 'Zaloguj się');
        btn.innerHTML = `Zaloguj`;
    }
};

// 4. Auth State Listener Initializer
window.initAuthListener = function() {
    if (!window.supabaseClient) {
        console.log("No Supabase Client. Session listener skipped. Operating in Guest-disabled offline mode.");
        STATE.isAuthenticated = true; // offline mock mode
        if (window.updateHeaderAuthButton) window.updateHeaderAuthButton();
        return;
    }

    // Set state default as unauthenticated guest
    STATE.isAuthenticated = false;

    window.supabaseClient.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth State Changed: ", event, session);
        
        if (session && session.user) {
            STATE.isAuthenticated = true;
            
            // Immediately populate currentUser with clean details matching auth metadata
            // to prevent temporary fallback or mock data of Jan Kowalski appearing
            const defaultName = session.user.user_metadata?.full_name || session.user.email.split('@')[0];
            const defaultRole = session.user.user_metadata?.role || 'twórca';
            const avatarUrl = session.user.user_metadata?.avatar_url || '';
            
            STATE.currentUser = {
                id: session.user.id,
                name: defaultName,
                role: defaultRole,
                email: session.user.email,
                avatar: avatarUrl,
                city: 'Wrocław',
                joined: new Date().toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' }),
                profession: defaultRole === 'twórca' ? 'Artysta' : 'Pasjonat',
                mainSpecialization: '',
                bio: defaultRole === 'twórca' ? 'Artysta / Rzemieślnik w ServeArt' : 'Miłośnik polskiego rzemiosła i handmade.',
                exclusions: 'Brak',
                tags: defaultRole === 'twórca' ? ['Rękodzieło'] : ['Kolekcja'],
                customMinBudget: 0,
                customMaxBudget: 0,
                customDeliveryTime: '',
                banner: 'gradient-5',
                isPremium: false,
                avatarShape: 'circle',
                offering: [],
                soughtProfessions: []
            };
            
            // Try fetching profile matching authenticated user id
            try {
                const { data: profile, error } = await window.supabaseClient
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .maybeSingle();

                if (error) throw error;

                if (profile) {
                    // Overwrite STATE.currentUser with actual data
                    STATE.currentUser = {
                        id: profile.id,
                        name: profile.name,
                        role: profile.role || 'twórca',
                        email: session.user.email,
                        avatar: profile.avatar || session.user.user_metadata.avatar_url || '',
                        city: profile.city || 'Wrocław',
                        joined: profile.joined || 'Sierpień 2023',
                        profession: profile.profession || 'Kolekcjoner i Twórca Rzemiosła',
                        mainSpecialization: profile.main_specialization || '',
                        bio: profile.bio || '',
                        exclusions: profile.exclusions || '',
                        tags: profile.tags || [],
                        customMinBudget: profile.custom_min_budget || 0,
                        customMaxBudget: profile.custom_max_budget || 0,
                        customDeliveryTime: profile.custom_delivery_time || '',
                        banner: profile.banner || 'gradient-5',
                        isPremium: profile.is_premium || false,
                        avatarShape: profile.avatar_shape || 'circle',
                        offering: profile.offering || [],
                        soughtProfessions: profile.sought_professions || []
                    };

                    // Persist for offline-like reading if needed
                    safeLocalStorage.setItem('serveart_user_id', profile.id);
                    safeLocalStorage.setItem('serveart_user_name', profile.name);
                    safeLocalStorage.setItem('serveart_user_role', profile.role);
                    safeLocalStorage.setItem('serveart_user_email', session.user.email);
                    safeLocalStorage.setItem('serveart_premium', profile.is_premium ? 'true' : 'false');
                    safeLocalStorage.setItem('serveart_avatar_shape', profile.avatar_shape);
                    safeLocalStorage.setItem('serveart_main_specialization', profile.main_specialization || '');
                    safeLocalStorage.setItem('serveart_user_avatar', profile.avatar || session.user.user_metadata.avatar_url || '');
                    safeLocalStorage.setItem('serveart_user_city', profile.city || 'Wrocław');
                    safeLocalStorage.setItem('serveart_user_joined', profile.joined || 'Sierpień 2023');
                    safeLocalStorage.setItem('serveart_user_profession', profile.profession || 'Kolekcjoner i Twórca Rzemiosła');
                    safeLocalStorage.setItem('serveart_user_bio', profile.bio || '');
                    safeLocalStorage.setItem('serveart_user_exclusions', profile.exclusions || '');
                    safeLocalStorage.setItem('serveart_user_banner', profile.banner || 'gradient-5');
                    safeLocalStorage.setItem('serveart_user_tags', JSON.stringify(profile.tags || []));
                    safeLocalStorage.setItem('serveart_user_customMinBudget', (profile.custom_min_budget || 0).toString());
                    safeLocalStorage.setItem('serveart_user_customMaxBudget', (profile.custom_max_budget || 0).toString());
                    safeLocalStorage.setItem('serveart_user_customDeliveryTime', profile.custom_delivery_time || '');
                    safeLocalStorage.setItem('serveart_user_cooperationEnabled', profile.cooperation_enabled !== false ? 'true' : 'false');
                    safeLocalStorage.setItem('serveart_user_sought_professions', JSON.stringify(profile.sought_professions || []));
                    safeLocalStorage.setItem('serveart_user_offering', JSON.stringify(profile.offering || []));
                } else {
                    // Profile not found in database, build one from auth metadata
                    console.warn("Auth user exists but profile row is missing. Creating fallback profile.");
                    const fallbackName = session.user.user_metadata.full_name || session.user.email.split('@')[0];
                    const fallbackRole = session.user.user_metadata.role || 'twórca';
                    const avatarUrl = session.user.user_metadata.avatar_url || '';
                    
                    const newProfile = {
                        id: session.user.id,
                        name: fallbackName,
                        role: fallbackRole,
                        avatar: avatarUrl,
                        city: 'Wrocław',
                        bio: fallbackRole === 'twórca' ? 'Artysta / Rzemieślnik w ServeArt' : 'Miłośnik polskiego rzemiosła i handmade.',
                        tags: fallbackRole === 'twórca' ? ['Rękodzieło'] : ['Kolekcja'],
                        joined: new Date().toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' }),
                        banner: 'gradient-5'
                    };

                    try {
                        await window.supabaseClient.from('profiles').insert(newProfile);
                    } catch (insErr) {
                        console.error("Error inserting profile:", insErr);
                    }
                    
                    STATE.currentUser = {
                        id: session.user.id,
                        name: newProfile.name,
                        role: newProfile.role,
                        email: session.user.email,
                        avatar: avatarUrl,
                        city: newProfile.city,
                        joined: newProfile.joined,
                        profession: newProfile.role === 'twórca' ? 'Artysta' : 'Pasjonat',
                        mainSpecialization: '',
                        bio: newProfile.bio,
                        exclusions: 'Brak',
                        tags: newProfile.tags,
                        customMinBudget: 0,
                        customMaxBudget: 0,
                        customDeliveryTime: '',
                        banner: newProfile.banner,
                        isPremium: false,
                        avatarShape: 'circle',
                        offering: [],
                        soughtProfessions: []
                    };
                    
                    safeLocalStorage.setItem('serveart_user_id', session.user.id);
                    safeLocalStorage.setItem('serveart_user_name', newProfile.name);
                    safeLocalStorage.setItem('serveart_user_role', newProfile.role);
                    safeLocalStorage.setItem('serveart_user_email', session.user.email);
                    safeLocalStorage.setItem('serveart_user_avatar', avatarUrl);
                    safeLocalStorage.setItem('serveart_user_city', newProfile.city);
                    safeLocalStorage.setItem('serveart_user_joined', newProfile.joined);
                    safeLocalStorage.setItem('serveart_user_profession', newProfile.role === 'twórca' ? 'Artysta' : 'Pasjonat');
                    safeLocalStorage.setItem('serveart_user_bio', newProfile.bio);
                    safeLocalStorage.setItem('serveart_user_exclusions', 'Brak');
                    safeLocalStorage.setItem('serveart_user_banner', newProfile.banner);
                    safeLocalStorage.setItem('serveart_user_tags', JSON.stringify(newProfile.tags));
                    safeLocalStorage.setItem('serveart_user_customMinBudget', '0');
                    safeLocalStorage.setItem('serveart_user_customMaxBudget', '0');
                    safeLocalStorage.setItem('serveart_user_customDeliveryTime', '');
                    safeLocalStorage.setItem('serveart_user_cooperationEnabled', 'true');
                    safeLocalStorage.setItem('serveart_user_sought_professions', '[]');
                    safeLocalStorage.setItem('serveart_user_offering', '[]');
                }
            } catch (e) {
                console.error("Error fetching/creating user profile:", e);
            }

            const authModal = document.getElementById('modal-auth');
            const wasLoggingIn = authModal && !authModal.classList.contains('hidden');

            // Sync database collections safely
            try {
                if (typeof window.syncFromSupabase === 'function') {
                    await window.syncFromSupabase();
                } else {
                    console.warn("window.syncFromSupabase is not defined.");
                }
            } catch (syncErr) {
                console.error("Error during syncFromSupabase in auth listener:", syncErr);
            }

            // Setup profile settings forms if exists
            const settingsName = document.getElementById('settings-username');
            const settingsEmail = document.getElementById('settings-email');
            if (settingsName) settingsName.value = STATE.currentUser.name;
            if (settingsEmail) settingsEmail.value = STATE.currentUser.email;

            // Close auth modal if open
            window.closeAuthModal();

            // Run pending callback if exist
            if (window.authSuccessCallback) {
                window.authSuccessCallback();
                window.authSuccessCallback = null;
            }

            // Re-render UI
            if (window.initializeUserChannels) window.initializeUserChannels();
            if (window.renderExploreFeed) window.renderExploreFeed();
            if (window.renderCommunityFeed) window.renderCommunityFeed();
            if (window.renderCooperationFeed) window.renderCooperationFeed();
            
            // Show welcome message
            console.log(`Welcome back, ${STATE.currentUser.name}!`);
            if (wasLoggingIn && window.showToast) {
                window.showToast(`Zalogowano pomyślnie! Witaj, ${STATE.currentUser.name}!`, "check_circle");
            }
        } else {
            // User is Guest
            STATE.isAuthenticated = false;
            
            // Set guest details to prevent UI reference crashes
            STATE.currentUser = {
                name: "Gość",
                role: 'entuzjasta',
                email: '',
                avatar: "", // Empty to trigger default guest profile icon
                city: "Wrocław",
                joined: "",
                profession: "Niezalogowany Użytkownik",
                mainSpecialization: "",
                bio: "Zaloguj się, aby zyskać dostęp do wszystkich funkcji społeczności, zamówień i ofert.",
                exclusions: "",
                tags: [],
                customMinBudget: 0,
                customMaxBudget: 0,
                customDeliveryTime: "",
                banner: "gradient-1",
                isPremium: false,
                avatarShape: 'circle',
                offering: [],
                soughtProfessions: []
            };

            // Sync database collections anyway so guest can browse public details
            try {
                if (typeof window.syncFromSupabase === 'function') {
                    await window.syncFromSupabase();
                } else {
                    console.warn("window.syncFromSupabase is not defined.");
                }
            } catch (syncErr) {
                console.error("Error during syncFromSupabase for Guest in auth listener:", syncErr);
            }

            // Re-render UI to display guest experience
            if (window.initializeUserChannels) window.initializeUserChannels();
            if (window.renderExploreFeed) window.renderExploreFeed();
            if (window.renderCommunityFeed) window.renderCommunityFeed();
            if (window.renderCooperationFeed) window.renderCooperationFeed();
        }
        if (window.updateHeaderAuthButton) window.updateHeaderAuthButton();
    });
};

window.selectRegRole = function(role) {
    const btnTworca = document.getElementById('reg-role-btn-tworca');
    const btnEntuzjasta = document.getElementById('reg-role-btn-entuzjasta');
    const hiddenInput = document.getElementById('reg-role-value');
    
    if (!btnTworca || !btnEntuzjasta || !hiddenInput) return;
    
    hiddenInput.value = role;
    
    if (role === 'twórca') {
        btnTworca.className = "py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-primary text-white shadow transition-all";
        btnEntuzjasta.className = "py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-transparent text-on-surface-variant transition-all";
    } else {
        btnTworca.className = "py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-transparent text-on-surface-variant transition-all";
        btnEntuzjasta.className = "py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-turquoise text-white shadow transition-all";
    }
};

// 5. Google Sign In Implementation
window.supabaseSignInWithGoogle = async function() {
    const errorMsg = document.getElementById('auth-error-msg');
    if (errorMsg) {
        errorMsg.innerText = '';
        errorMsg.classList.add('hidden');
    }
    
    try {
        if (!window.supabaseClient) {
            throw new Error("Klient Supabase nie jest zainicjalizowany.");
        }
        
        const { error } = await window.supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + window.location.pathname
            }
        });
        
        if (error) throw error;
    } catch (err) {
        console.error("Google login error:", err);
        if (errorMsg) {
            errorMsg.innerText = "Błąd logowania Google: " + err.message;
            errorMsg.classList.remove('hidden');
        } else {
            alert("Błąd logowania Google: " + err.message);
        }
    }
};

// 6. Quick Test Accounts SignIn helper
window.quickSignIn = async function(roleType) {
    const errorMsg = document.getElementById('auth-error-msg');
    const successMsg = document.getElementById('auth-success-msg');
    if (errorMsg) errorMsg.classList.add('hidden');
    if (successMsg) successMsg.classList.add('hidden');
    
    if (window.showToast) {
        window.showToast("Logowanie testowe...", "sync");
    }

    let email, password, fullName, role;
    if (roleType === 'admin') {
        email = 'admin@serveart.pl';
        password = 'Password123!';
        fullName = 'Admin Testowy';
        role = 'admin';
    } else if (roleType === 'tworca') {
        email = 'tworca@serveart.pl';
        password = 'Password123!';
        fullName = 'Jan Kowalski';
        role = 'twórca';
    } else { // kupujacy
        email = 'kupujacy@serveart.pl';
        password = 'Password123!';
        fullName = 'Anna Nowak';
        role = 'entuzjasta';
    }

    const doOfflineFallbackSignIn = function() {
        console.warn("Using offline mock fallback login.");
        STATE.isAuthenticated = true;
        STATE.currentUser = {
            id: 'mock_' + roleType,
            name: fullName,
            role: role,
            email: email,
            avatar: '',
            city: 'Wrocław',
            joined: 'Lipiec 2026',
            profession: role === 'admin' ? 'Administrator' : (role === 'twórca' ? 'Artysta' : 'Pasjonat'),
            mainSpecialization: '',
            bio: role === 'admin' ? 'Konto Administratora Prototypu' : 'Konto testowe',
            exclusions: 'Brak',
            tags: [],
            customMinBudget: 0,
            customMaxBudget: 0,
            customDeliveryTime: '',
            banner: 'gradient-5',
            isPremium: role === 'admin',
            avatarShape: 'circle',
            offering: [],
            soughtProfessions: []
        };
        safeLocalStorage.setItem('serveart_logged_in', 'true');
        safeLocalStorage.setItem('serveart_user_id', STATE.currentUser.id);
        safeLocalStorage.setItem('serveart_user_name', STATE.currentUser.name);
        safeLocalStorage.setItem('serveart_user_role', STATE.currentUser.role);
        safeLocalStorage.setItem('serveart_user_email', STATE.currentUser.email);
        
        window.closeAuthModal();
        if (window.initializeUserChannels) window.initializeUserChannels();
        if (window.renderExploreFeed) window.renderExploreFeed();
        if (window.renderCommunityFeed) window.renderCommunityFeed();
        if (window.renderCooperationFeed) window.renderCooperationFeed();
        if (window.updateHeaderAuthButton) window.updateHeaderAuthButton();
        if (window.showToast) {
            window.showToast(`Zalogowano jako ${STATE.currentUser.name} (Offline Mock)`, "check_circle");
        }
    };

    if (!window.supabaseClient) {
        doOfflineFallbackSignIn();
        return;
    }

    try {
        // Try to sign in first
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            // If user doesn't exist, register them
            if (error.message.includes('Invalid login credentials') || error.status === 400) {
                if (window.showToast) {
                    window.showToast("Tworzenie konta testowego w chmurze...", "sync");
                }
                
                // Sign up using signUp
                const { data: signUpData, error: signUpError } = await window.supabaseClient.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: fullName,
                            role: role
                        }
                    }
                });

                if (signUpError) throw signUpError;
                
                // Re-attempt sign-in
                const { error: reSignInError } = await window.supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });
                if (reSignInError) throw reSignInError;
            } else {
                throw error;
            }
        }
    } catch (err) {
        console.warn("Real login failed. Falling back to offline mock mode:", err);
        doOfflineFallbackSignIn();
    }
};

