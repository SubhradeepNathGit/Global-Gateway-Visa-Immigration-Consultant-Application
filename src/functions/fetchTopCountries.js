import supabase from "../util/Supabase/supabase";

export const fetchAppliedCountryStatsByOriginId = async (originCountryId) => {
    const { data: applications, error: appError } = await supabase.from("applications").select("id, user_id, country_id").in("country_id", [originCountryId]);

    if (appError) throw appError;

    const userList = applications.map(app => app.user_id);

    const { data: users, error: userError } = await supabase.from("users").select("id, country").in("id", userList);

    if (userError) throw userError;

    const stats = {};

    users.forEach(app => {

        if (!stats[app?.country]) {
            stats[app?.country] = {
                countryName: app?.country,
                applications: 0,
            };
        }

        stats[app?.country].applications += 1;
    });

    const result = Object.values(stats);

    return result
};
