// /**
//  * Project related APIs
//  * ---------------------
//  * Only project-by-id exists today
//  * All-projects will be added later
//  */

// export const projectService = {
//   async getProjectById(projectId: number) {
//     const token = localStorage.getItem('access_token');
//     if (!token) throw new Error('Missing token');

//     const res = await fetch(
//       `http://127.0.0.1:8000/api/v1/users/project/${projectId}`,
//       {
//         headers: {
//           Accept: 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!res.ok) {
//       throw new Error('Failed to fetch project');
//     }

//     return res.json();
//   },

//   /**
//    * FUTURE
//    * ------
//    * async getAllProjects() {
//    *   const res = await fetch('/api/projects');
//    *   return res.json();
//    * }
//    */
// };
