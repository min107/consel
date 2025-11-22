// Supabase Client Initialization
const SUPABASE_URL = 'https://lrnutmjafqqlzopxswsa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxybnV0bWphZnFxbHpvcHhzd3NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTU4NDIsImV4cCI6MjA3ODU5MTg0Mn0.JJJtqAKfYSzlSky0gYNKbQJF_j0YUPYf2jquyInnvpk';

// Initialize Supabase client
let supabase;

function initSupabase() {
    // Check if Supabase library is loaded
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase library not loaded. Make sure to include the CDN script.');
        return null;
    }
    
    // Create client if not already created
    if (!supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Set up auth state change listener
        supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth State Change:', event, session);
            if (event === 'SIGNED_OUT') {
                // Redirect to login if not already there
                const currentPath = window.location.pathname;
                if (!currentPath.includes('index.html') && currentPath !== '/' && !currentPath.endsWith('/')) {
                    window.location.href = 'index.html';
                }
            }
        });
    }
    
    return supabase;
}

// Try to initialize immediately
if (typeof window.supabase !== 'undefined') {
    initSupabase();
} else {
    // Wait for Supabase to load if it hasn't loaded yet
    window.addEventListener('load', () => {
        if (typeof window.supabase !== 'undefined') {
            initSupabase();
        }
    });
}

// Helper functions - these will work once supabase is initialized
async function signIn(email, password) {
    if (!supabase) {
        supabase = initSupabase();
    }
    if (!supabase) {
        return { data: null, error: { message: 'Supabase not initialized' } };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
    return { data, error };
}

async function signOut() {
    if (!supabase) {
        supabase = initSupabase();
    }
    if (!supabase) {
        return { error: { message: 'Supabase not initialized' } };
    }
    const { error } = await supabase.auth.signOut();
    return { error };
}

async function getCurrentUser() {
    if (!supabase) {
        supabase = initSupabase();
    }
    if (!supabase) {
        return null;
    }
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Make sure supabase is available when needed
function ensureSupabase() {
    if (!supabase) {
        supabase = initSupabase();
    }
    return supabase;
}
