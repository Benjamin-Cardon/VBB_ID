import { Dayjs } from "dayjs";
import internal from "stream";

export type state_toggle = true | false | null;
export type grade_level = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | 'College/University';
export type family_members = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | "10 or More"
export type family_status = "Living with both parents" | "Living with one parent (due to death, divorce, separation)" | "Living with grandparents or other relatives" | "Living in a foster home or under the care of a guardian" | "Living in a child-headed household (no adult caregivers)" | "Orphaned (both parents deceased)" | "Street-connected children/youth (with loose family ties)" | "Internally displaced or refugee status";
export type family_members_with_income = "0" | "1" | "2" | "3 or more"
export type barriers_to_education = "Family Responsibilities: Need to work or take care of siblings" | "Family and Cultural Barriers: Lack of family support, cultural barriers to education" | "Financial Constraints: Lack of money to buy food or pay school fees, not enough money for education" | "Distance from School: No nearby schools" | "Lack of School Materials: Books, uniforms, schools without proper resources" | "Safety concerns: on the way to school or in school" | "Health and Nutrition Issues: Lack of proper nutrition causing health issues, poor health or disabilities" | "Lack of Technology Access: Internet, computers for homework or study"
  | "Early Life Changes: Early marriage, pregnancy" | "Insufficient Educational Infrastructure: Insufficient teachers, overcrowded classes, limited opportunities for higher education" | "Political Instability";
export type family_support_level = '1' | '2' | '3' | '4' | '5'
export type subjects = "Languages: the official language, local dialects, and international language." | "Mathematics" | "Sciences: Biology, Chemistry, Physics, and advanced sciences." | "Social Studies/History: History, geography, and often region-specific topics." | "Arts and Culture: music, art, and cultural studies." | "Physical Education: sports and physical activities." | "Information Technology: computer skills and IT skills"
export type library_discovery_method = "Through a friend" | "From my school teacher" | "I saw it and decided to give it a try" | "I personally know the librarian" | "Community outreach"
export type library_travel_time = "Less than 15 minutes" | "15 - 30 minutes" | "30 - 45 minutes" | "1 - 1.5 hours" | "1.5 - 2 hours" | "2 - 3 hours" | "3 - 4 hours" | "More than 4 hours"
export type desired_library_resource = "More Books and E-books" | "Study and Meeting Spaces" | "Computers and Internet Access" | "Workshops and Educational Programs"
  | "Educational activities" | "Multimedia Resources: Access to audio - books, movies, music, and other digital media." | "Career and Job Assistance" | "Art supplies"
export type library_attendance_goal = "Improve my performance in one or more school subjects" | "Enhance my language skills" | "Access computers and the internet" | "Read or borrow books" | "Utilize a quiet space for studying" | "Participate in the mentor program"
export type gender = 'male' | 'female';

export interface login_state {
  username: string,
  password: string,
  library: string,
}

export interface register_state {
  mentorship_user_id: null | string;
  first_name: string;
  last_name: string;
  gender: gender | '';
  date: Dayjs | null;
  grade_level: grade_level | '';
  family_members: family_members | '';
  family_status: family_status | "";
  family_members_with_income: family_members_with_income | "";
  barriers_to_education: barriers_to_education | "";
  family_support_level: family_support_level | "";
  favorite_subject: subjects | "";
  percieved_most_useful_subject: subjects | "";
  percieved_most_difficult_subject: subjects | "";
  library_discovery_method: library_discovery_method | "";
  library_travel_time: library_travel_time | "";
  desired_library_resource: desired_library_resource | "";
  library_attendance_goal: library_attendance_goal | "";
}

export type patron = {
  patron_id: string;
  last_login: string | null;
  count_logins: Number;
  profile: {
    first_name: string;
    last_name: string;
    gender: gender | '';
    date: string | null;
    grade_level: grade_level | '';
    family_members: family_members | '';
    family_status: family_status | "";
    family_members_with_income: family_members_with_income | "";
    barriers_to_education: barriers_to_education[];
    family_support_level: family_support_level | "";
    favorite_subject: subjects | "";
    percieved_most_useful_subject: subjects | "";
    percieved_most_difficult_subject: subjects | "";
    library_discovery_method: library_discovery_method | "";
    library_travel_time: library_travel_time | "";
    desired_library_resource: desired_library_resource[];
    library_attendance_goal: library_attendance_goal[];
  };
}

