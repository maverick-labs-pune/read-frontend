/*
 *  Copyright (c) 2020 Maverick Labs
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as,
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import SchoolContainer from "./../containers/School/SchoolContainer";
import StudentContainer from "./../containers/Student/StudentContainer";
import BookContainer from "../containers/Book/BookContainer";
import NgoListContainer from "../containers/Ngo/NgoListContainer";
import NgoDetailsContainer from "../containers/Ngo/NgoDetailsContainer";
import SessionContainer from "../containers/Session/SessionContainer";
import UsersContainer from "../containers/Users/UsersContainer";
import SchoolDetailsContainer from "../containers/School/SchoolDetailsContainer";
import StudentDetailContainer from "../containers/Student/StudentDetailContainer";
import SessionDetailContainer from "../containers/Session/SessionDetailContainer";
import filter from "lodash/filter";
import includes from "lodash/includes";
import BookFairySessionContainer from "../containers/Session/BookFairySessionContainer";
import BookFairySessionDetailContainer from "../containers/Session/BookFairySessionDetailContainer";
import SupervisorSessionContainer from "../containers/Session/SupervisorSessionContainer";
import SupervisorSessionDetailContainer from "../containers/Session/SupervisorSessionDetailContainer";
import ClassroomDetailContainer from "../containers/Classroom/ClassroomDetailContainer";
import BookDetailContainer from "../containers/Book/BookDetailContainer";

export const routes = {
  "NGO Admin": [
    {
      key: "SCHOOLS",
      path: "/home/schools",
      component: SchoolContainer,
      id: "schools"
    },
    {
      key: "SCHOOL_DETAILS",
      path: "/home/schools/:key",
      component: SchoolDetailsContainer,
      id: "schools"
    },
    {
      key: "SCHOOL_CLASSROOM_DETAILS",
      path: "/home/schools/:key/classroom/:classroomkey",
      component: ClassroomDetailContainer,
      id: "schools"
    },
    {
      key: "BOOKS",
      path: "/home/books",
      component: BookContainer,
      id: "books"
    },
    {
      key: "BOOK_DETAILS",
      path: "/home/books/:key",
      component: BookDetailContainer,
      id: "books"
    },
    {
      key: "STUDENTS",
      path: "/home/students",
      component: StudentContainer,
      id: "books"
    },
    {
      key: "STUDENT_DETAILS",
      path: "/home/students/:key",
      component: StudentDetailContainer,
      id: "students"
    },
    {
      key: "SESSIONS",
      path: "/home/sessions",
      component: SessionContainer,
      id: "read_sessions"
    },
    {
      key: "SESSION_DETAILS",
      path: "/home/sessions/:key/:type",
      component: SessionDetailContainer,
      id: "read_sessions"
    },
    {
      key: "USERS",
      path: "/home/users",
      component: UsersContainer,
      id: "users"
    },
    {
      key: "NGO",
      path: "/home/ngos",
      component: NgoListContainer,
      id: "ngos"
    },
    {
      key: "NGO_DETAILS",
      path: "/home/ngos/:key",
      component: NgoDetailsContainer,
      id: "ngos"
    }
  ],
  "READ Admin": [
    {
      key: "NGO",
      path: "/home/ngos",
      component: NgoListContainer,
      id: "ngos"
    },
    {
      key: "NGO_DETAILS",
      path: "/home/ngos/:key",
      component: NgoDetailsContainer,
      id: "ngos"
    }
    // {
    //   key: "REPORTS",
    //   path: "/home/reports",
    //   component: NgoListContainer,
    //   id: "schools"
    // }
  ],
  "Book Fairy": [
    {
      key: "SESSIONS",
      path: "/home/sessions",
      component: BookFairySessionContainer,
      id: "read_sessions"
    },
    {
      key: "SESSION_DETAILS",
      path: "/home/sessions/:key/:type",
      component: BookFairySessionDetailContainer,
      id: "read_sessions"
    }
  ],
  Supervisor: [
    {
      key: "SESSIONS",
      path: "/home/sessions",
      component: SupervisorSessionContainer,
      id: "read_sessions"
    },
    {
      key: "SESSION_DETAILS",
      path: "/home/sessions/:key/:type",
      component: SupervisorSessionDetailContainer,
      id: "read_sessions"
    }
  ]
};

export const getRoutes = () => {
  let permissions = JSON.parse(localStorage.getItem("permissions"));
  let group = localStorage.getItem("group");
  let routesForUserGroup = routes[group];
  let routeArr = filter(routesForUserGroup, value => {
    if (includes(Object.keys(permissions), value.id)) return true;
  });
  return routeArr;
};
