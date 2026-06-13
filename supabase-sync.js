// Supabase synchronization helper functions for ServeArt

// Load initial data from Supabase and overwrite STATE
window.syncFromSupabase = async function() {
    if (!window.supabaseClient) {
        console.log("Supabase client is not configured. Using local mock data.");
        return false;
    }

    try {
        console.log("Starting data synchronization from Supabase...");

        // 1. Fetch Profiles
        const { data: profiles, error: errProfiles } = await window.supabaseClient
            .from('profiles')
            .select('*');
        if (errProfiles) throw errProfiles;

        if (profiles && profiles.length > 0) {
            // Update creators
            STATE.creators = profiles.filter(p => p.role === 'twórca').map(p => ({
                name: p.name,
                avatar: p.avatar || '',
                city: p.city || '',
                rating: p.rating || '5.0',
                profession: p.profession || '',
                mainSpecialization: p.main_specialization || '',
                bio: p.bio || '',
                exclusions: p.exclusions || '',
                joined: p.joined || '',
                isPremium: p.is_premium || false,
                avatarShape: p.avatar_shape || 'circle',
                tags: p.tags || [],
                customMinBudget: p.custom_min_budget || 0,
                customMaxBudget: p.custom_max_budget || 0,
                customDeliveryTime: p.custom_delivery_time || '',
                banner: p.banner || 'gradient-1',
                offering: p.offering || []
            }));

            // Sync current user settings
            const currentName = STATE.currentUser.name;
            const myProfile = profiles.find(p => p.name === currentName);
            if (myProfile) {
                STATE.currentUser = {
                    ...STATE.currentUser,
                    name: myProfile.name,
                    role: myProfile.role || 'twórca',
                    city: myProfile.city || '',
                    profession: myProfile.profession || '',
                    mainSpecialization: myProfile.main_specialization || '',
                    bio: myProfile.bio || '',
                    exclusions: myProfile.exclusions || '',
                    tags: myProfile.tags || [],
                    customMinBudget: myProfile.custom_min_budget || 0,
                    customMaxBudget: myProfile.custom_max_budget || 0,
                    customDeliveryTime: myProfile.custom_delivery_time || '',
                    banner: myProfile.banner || 'gradient-1',
                    isPremium: myProfile.is_premium || false,
                    avatarShape: myProfile.avatar_shape || 'circle',
                    offering: myProfile.offering || [],
                    soughtProfessions: myProfile.sought_professions || []
                };
            }
        }

        // 2. Fetch Listings
        const { data: listings, error: errListings } = await window.supabaseClient
            .from('listings')
            .select('*')
            .order('created_at', { ascending: false });
        if (errListings) throw errListings;

        if (listings) {
            STATE.listings = listings.map(l => ({
                id: l.id,
                creator: l.creator_name,
                title: l.title,
                price: l.price,
                image: l.image,
                tags: l.tags || [],
                category: l.category,
                itemType: l.item_type,
                materials: l.materials || [],
                colors: l.colors || [],
                isAiFree: l.is_ai_free || false,
                isHandmade: l.is_handmade || true,
                description: l.description,
                processPics: l.process_pics || []
            }));
        }

        // 3. Fetch Posts
        const { data: posts, error: errPosts } = await window.supabaseClient
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });
        if (errPosts) throw errPosts;

        if (posts) {
            // Fetch comments for posts
            const { data: comments, error: errComments } = await window.supabaseClient
                .from('comments')
                .select('*');
            if (errComments) throw errComments;

            STATE.posts = posts.map(p => ({
                id: p.id,
                creator: p.creator_name,
                profession: p.profession,
                avatar: p.avatar || '',
                text: p.text,
                images: p.images || [],
                likes: p.likes || 0,
                liked: false,
                date: p.date,
                channelId: p.channel_id || 'malarstwo',
                tags: p.tags || [],
                comments: (comments || [])
                    .filter(c => c.post_id === p.id)
                    .map(c => ({
                        author: c.author,
                        text: c.text,
                        time: c.time,
                        image: c.image || ''
                    }))
            }));
        }

        // 4. Fetch Cooperations
        const { data: coops, error: errCoops } = await window.supabaseClient
            .from('cooperations')
            .select('*')
            .order('created_at', { ascending: false });
        if (errCoops) throw errCoops;

        if (coops) {
            STATE.cooperations = coops.map(c => ({
                id: c.id,
                creator: c.creator_name,
                city: c.city || '',
                avatar: c.avatar || '',
                description: c.description,
                soughtProfessions: c.sought_professions || [],
                profession: c.profession || '',
                shareLocation: c.share_location !== false
            }));
        }

        // 5. Fetch Messages (Chats)
        const { data: messages, error: errMsgs } = await window.supabaseClient
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true });
        if (errMsgs) throw errMsgs;

        if (messages) {
            STATE.chats = {};
            messages.forEach(m => {
                if (!STATE.chats[m.chat_partner]) {
                    STATE.chats[m.chat_partner] = [];
                }
                STATE.chats[m.chat_partner].push({
                    sender: m.sender,
                    text: m.text,
                    time: m.time
                });
            });
        }

        console.log("Supabase synchronization completed successfully.");
        return true;
    } catch (error) {
        console.error("Error during Supabase synchronization:", error);
        return false;
    }
};

// Sync Writes to Supabase
window.supabaseSyncProfile = async function(profileData) {
    if (!window.supabaseClient) return;
    try {
        const { error } = await window.supabaseClient
            .from('profiles')
            .upsert({
                name: profileData.name,
                avatar: profileData.avatar || '',
                city: profileData.city || '',
                profession: profileData.profession || '',
                main_specialization: profileData.mainSpecialization || '',
                bio: profileData.bio || '',
                exclusions: profileData.exclusions || '',
                is_premium: profileData.isPremium || false,
                avatar_shape: profileData.avatarShape || 'circle',
                tags: profileData.tags || [],
                custom_min_budget: profileData.customMinBudget || 0,
                custom_max_budget: profileData.customMaxBudget || 0,
                custom_delivery_time: profileData.customDeliveryTime || '',
                banner: profileData.banner || 'gradient-1',
                offering: profileData.offering || [],
                sought_professions: profileData.soughtProfessions || [],
                role: profileData.role || 'twórca'
            }, { onConflict: 'name' });
        if (error) throw error;
        console.log("Profile successfully updated in Supabase.");
    } catch (e) {
        console.error("Supabase Profile Sync failed:", e);
    }
};

window.supabaseSyncListing = async function(listing) {
    if (!window.supabaseClient) return;
    try {
        const { error } = await window.supabaseClient
            .from('listings')
            .upsert({
                id: listing.id,
                creator_name: listing.creator,
                title: listing.title,
                price: listing.price,
                image: listing.image,
                tags: listing.tags || [],
                category: listing.category,
                item_type: listing.itemType,
                materials: listing.materials || [],
                colors: listing.colors || [],
                is_ai_free: listing.isAiFree || false,
                is_handmade: listing.isHandmade || true,
                description: listing.description,
                process_pics: listing.processPics || []
            }, { onConflict: 'id' });
        if (error) throw error;
        console.log("Listing successfully saved/updated in Supabase.");
    } catch (e) {
        console.error("Supabase Listing Sync failed:", e);
    }
};

window.supabaseSyncPost = async function(post) {
    if (!window.supabaseClient) return;
    try {
        const { error } = await window.supabaseClient
            .from('posts')
            .insert({
                id: post.id,
                creator_name: post.creator,
                profession: post.profession,
                avatar: post.avatar || '',
                text: post.text,
                images: post.images || [],
                likes: post.likes || 0,
                date: post.date,
                channel_id: post.channelId || 'malarstwo',
                tags: post.tags || []
            });
        if (error) throw error;
        console.log("Post successfully saved to Supabase.");
    } catch (e) {
        console.error("Supabase Post Sync failed:", e);
    }
};

window.supabaseSyncComment = async function(postId, comment) {
    if (!window.supabaseClient) return;
    try {
        const { error } = await window.supabaseClient
            .from('comments')
            .insert({
                post_id: postId,
                author: comment.author,
                text: comment.text,
                time: comment.time,
                image: comment.image || ''
            });
        if (error) throw error;
        console.log("Comment successfully saved to Supabase.");
    } catch (e) {
        console.error("Supabase Comment Sync failed:", e);
    }
};

window.supabaseSyncCooperation = async function(coop) {
    if (!window.supabaseClient) return;
    try {
        const { error } = await window.supabaseClient
            .from('cooperations')
            .upsert({
                id: coop.id,
                creator_name: coop.creator,
                city: coop.city || '',
                avatar: coop.avatar || '',
                description: coop.description,
                sought_professions: coop.soughtProfessions || [],
                profession: coop.profession || '',
                share_location: coop.shareLocation !== false
            }, { onConflict: 'id' });
        if (error) throw error;
        console.log("Cooperation listing successfully saved/updated in Supabase.");
    } catch (e) {
        console.error("Supabase Cooperation Sync failed:", e);
    }
};

window.supabaseSyncMessage = async function(chatPartner, message) {
    if (!window.supabaseClient) return;
    try {
        const { error } = await window.supabaseClient
            .from('messages')
            .insert({
                chat_partner: chatPartner,
                sender: message.sender,
                text: message.text,
                time: message.time
            });
        if (error) throw error;
        console.log("Message successfully saved to Supabase.");
    } catch (e) {
        console.error("Supabase Message Sync failed:", e);
    }
};
