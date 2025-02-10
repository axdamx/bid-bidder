// import { createBrowserClient } from "@supabase/ssr";

// let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

// export const createClientSupabase = () => {
//   if (!supabaseClient) {
//     supabaseClient = createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//       {
//         realtime: {
//           params: {
//             eventsPerSecond: 10
//           }
//         }
//       }
//     );
//   }
//   return supabaseClient;
// };

import { createBrowserClient } from "@supabase/ssr";

export const createClientSupabase = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
  );
};
