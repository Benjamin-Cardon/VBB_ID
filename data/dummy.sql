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