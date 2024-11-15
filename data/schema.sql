CREATE SCHEMA IF NOT EXISTS id_system;

CREATE TABLE IF NOT EXISTS id_system.patrons
(
    patron_id character varying(255) COLLATE pg_catalog."default" PRIMARY KEY NOT NULL,
    library_id bigint NOT NULL,
	is_student boolean NOT NULL,
	user_id bigint,
    first_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    gender character varying(255) COLLATE pg_catalog."default",
    date_of_birth date,
    grade_level character varying(255) COLLATE pg_catalog."default",
    immediate_family_members character varying(255) COLLATE pg_catalog."default",
    family_status character varying(255) COLLATE pg_catalog."default",
    family_members_with_income character varying(255) COLLATE pg_catalog."default",
    barriers_to_education TEXT[],
    family_support_level integer,
    favorite_subject character varying(255) COLLATE pg_catalog."default",
    percieved_most_useful_subject character varying(255) COLLATE pg_catalog."default",
    percieved_most_difficult_subject character varying(255) COLLATE pg_catalog."default",
    library_discovery_method character varying(255) COLLATE pg_catalog."default",
    library_travel_time character varying(255) COLLATE pg_catalog."default",
    desired_library_resources TEXT[],
    library_attendance_goal TEXT[]
);

CREATE TABLE IF NOT EXISTS id_system.librarians
(
    id bigserial Unique NOT NULL,
    user_id bigint,
    library_id bigint NOT NULL,
    password character varying(255) COLLATE pg_catalog."default",
    username character varying(255) COLLATE pg_catalog."default",
    first_name character varying(255) COLLATE pg_catalog."default",
    last_name character varying(255) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default",
    current_librarian boolean
);

CREATE TABLE IF NOT EXISTS id_system.attendance_log
(
  id bigserial NOT NULL,
  patron_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
  library_id bigint NOT NULL,
  time_attended date
);


Create TABLE IF NOT EXISTS id_system.librarian_logins(
	id bigserial NOT NULL,
	session_id character varying(255) COLLATE pg_catalog."default" UNIQUE NOT NULL
);


ALTER TABLE id_system.librarian_logins
ADD PRIMARY KEY (session_id);

ALTER TABLE id_system.attendance_log
ADD PRIMARY KEY (id);

ALTER TABLE id_system.librarians
ADD CONSTRAINT fk_librarians_belong_to_libraries FOREIGN KEY (library_id) REFERENCES libraries_library(id);

ALTER TABLE id_system.patrons
ADD CONSTRAINT fk_patrons_belong_to_libraries FOREIGN KEY (library_id) REFERENCES libraries_library(id);

ALTER TABLE id_system.attendance_log
ADD CONSTRAINT fk_attendance_done_by_patron FOREIGN KEY (patron_id) REFERENCES id_system.patrons(patron_id);

ALTER TABLE id_system.attendance_log
ADD CONSTRAINT fk_attendance_at_library FOREIGN KEY (library_id) REFERENCES libraries_library(id);

ALTER TABLE id_system.librarian_logins
ADD COLUMN librarian_id BIGINT, -- Change the data type according to your requirements
ADD CONSTRAINT fk_librarian_id FOREIGN KEY (librarian_id) REFERENCES id_system.librarians(id);

ALTER TABLE id_system.librarian_logins
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE id_system.attendance_log
ALTER COLUMN time_attended SET DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE id_system.library_patron_count_incrementer(
    library_id bigint unique,
    patron_count_incrementer bigint
);

ALTER TABLE id_system.library_patron_count_incrementer
ADD PRIMARY KEY (library_id);

ALTER TABLE id_system.library_patron_count_incrementer
ADD CONSTRAINT fk_patroncounts_belong_to_libraries FOREIGN KEY (library_id) REFERENCES libraries_library(id);

/*CREATE TABLE IF NOT EXISTS public.profiles_studentprofile
(
    id bigserial NOT NULL,
    is_active boolean NOT NULL,
    is_verified boolean NOT NULL,
    assigned_library_id bigint,
    user_id bigint NOT NULL,
    bio text COLLATE pg_catalog."default" NOT NULL,
    family_status character varying(255) COLLATE pg_catalog."default" NOT NULL,
    family_support_level integer,
    grade_level integer,
    graduation_obstacle character varying(255) COLLATE pg_catalog."default" NOT NULL,
    is_onboarded boolean NOT NULL,
    approval_status character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT profiles_studentprofile_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_studentprofile_user_id_key UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.profiles_studentprofile_careers_of_interest
(
    id bigserial NOT NULL,
    studentprofile_id bigint NOT NULL,
    career_id bigint NOT NULL,
    CONSTRAINT profiles_studentprofile_careers_of_interest_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_studentprofile__studentprofile_id_career_fec904ee_uniq UNIQUE (studentprofile_id, career_id)
);

CREATE TABLE IF NOT EXISTS public.profiles_studentprofile_favorite_genres
(
    id bigserial NOT NULL,
    studentprofile_id bigint NOT NULL,
    genre_id bigint NOT NULL,
    CONSTRAINT profiles_studentprofile_favorite_genres_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_studentprofile__studentprofile_id_genre__4c05fe30_uniq UNIQUE (studentprofile_id, genre_id)
);

CREATE TABLE IF NOT EXISTS public.profiles_studentprofile_mentoring_languages
(
    id bigserial NOT NULL,
    studentprofile_id bigint NOT NULL,
    language_id bigint NOT NULL,
    CONSTRAINT profiles_studentprofile_mentoring_languages_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_studentprofile__studentprofile_id_langua_679c3eab_uniq UNIQUE (studentprofile_id, language_id)
);

CREATE TABLE IF NOT EXISTS public.profiles_studentprofile_subjects
(
    id bigserial NOT NULL,
    studentprofile_id bigint NOT NULL,
    subject_id bigint NOT NULL,
    CONSTRAINT profiles_studentprofile_subjects_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_studentprofile__studentprofile_id_subjec_cacef79b_uniq UNIQUE (studentprofile_id, subject_id)
);

CREATE TABLE IF NOT EXISTS public.subjects_genre
(
    id bigserial NOT NULL,
    "uniqueID" uuid NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT subjects_genre_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.subjects_subject
(
    id bigserial NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "uniqueID" uuid NOT NULL,
    CONSTRAINT subjects_subject_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.users_user
(
    id bigserial NOT NULL,
    password character varying(128) COLLATE pg_catalog."default" NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) COLLATE pg_catalog."default",
    first_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL,
    email character varying(255) COLLATE pg_catalog."default",
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    time_zone character varying(255) COLLATE pg_catalog."default",
    is_librarian boolean NOT NULL,
    is_mentor boolean NOT NULL,
    is_student boolean NOT NULL,
    date_of_birth date,
    is_email_verified boolean NOT NULL,
    "profileImage" character varying(512) COLLATE pg_catalog."default" NOT NULL,
    role integer,
    gender character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_user_pkey PRIMARY KEY (id),
    CONSTRAINT users_user_email_key UNIQUE (email),
    CONSTRAINT users_user_username_key UNIQUE (username)
);
);*/