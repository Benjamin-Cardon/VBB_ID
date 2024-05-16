INSERT INTO public.librarians (platform_user_id, library_id, password, username, first_name, last_name, email, current_librarian)
VALUES (123456, 1, 'password123', 'librarian1', 'John', 'Doe', 'john.doe@example.com', true);

INSERT INTO public.librarians (platform_user_id, library_id, password, username, first_name, last_name, email, current_librarian)
VALUES (789012, 2, 'securepass', 'librarian2', 'Jane', 'Smith', 'jane.smith@example.com', true);

INSERT INTO public.librarians (platform_user_id, library_id, password, username, first_name, last_name, email, current_librarian)
VALUES (345678, 3, 'strongpassword', 'librarian3', 'Michael', 'Johnson', 'michael.johnson@example.com', false);

INSERT INTO public.libraries (name, address_1, city, country, postal_code, state_province)
VALUES ('Main Library', '123 Main St', 'Cityville', 'Countryland', '12345', 'State A');

-- Example 2
INSERT INTO public.libraries (name, address_1, city, country, postal_code, state_province)
VALUES ('Branch Library', '456 Elm St', 'Townsville', 'Countryland', '54321', 'State B');

-- Example 3
INSERT INTO public.libraries (name, address_1, city, country, postal_code, state_province)
VALUES ('Central Library', '789 Oak St', 'Villagetown', 'Countryland', '98765', 'State C');

INSERT INTO public.patrons (patron_id, library_id, first_name, last_name, gender, date_of_birth, grade_level, immediate_family_members, family_status, family_members_with_income, barriers_to_education, family_support_level, favorite_subject, perceived_most_useful_subject, perceived_most_difficult_subject, library_discovery_method, library_travel_time, desired_library_resources, library_attendance_goal)
VALUES
('STMAI24001', 1, 'John', 'Doe', 'Male', '1990-05-15', 12, 4, 'Married', 2, 'Financial', 3, 'Mathematics', 'Science', 'History', 'Internet', '30 minutes', 'Books, Internet', 'Twice a week'),
('STMAI24002', 1, 'Jane', 'Smith', 'Female', '1995-08-20', 11, 3, 'Single', 1, 'Time', 2, 'English', 'Mathematics', 'Science', 'Friend', '20 minutes', 'Books', 'Once a week'),
('NSBRA24001', 2, 'Michael', 'Johnson', 'Male', '1988-12-10', 10, 2, 'Married', 3, 'Location', 3, 'History', 'Science', 'Mathematics', 'School', '15 minutes', 'Books', 'Twice a month'),
('STCEN24001', 3, 'Emily', 'Williams', 'Female', '1998-03-25', 9, 2, 'Single', 1, 'Interest', 2, 'Art', 'Music', 'Mathematics', 'Advertisement', '25 minutes', 'Books, Music', 'Once a month');