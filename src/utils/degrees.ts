const degrees = [
    {
      degreeTitle: "Bachelor of Liberal Arts",
      degreeReference: "ALB",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Doctor of Musical Arts",
      degreeReference: "AMUSD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Associate of Arts",
      degreeReference: "AA",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate of Applied Arts",
      degreeReference: "AAA",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate of Applied Business",
      degreeReference: "AAB",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate in Allied Health",
      degreeReference: "AAH",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate of Arts in Nursing",
      degreeReference: "AAN",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate in Applied Science",
      degreeReference: "AAS",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate of Arts and Sciences",
      degreeReference: "AAS",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate of Arts in Teaching",
      degreeReference: "AAT",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate of Applied Technology",
      degreeReference: "AAT",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate in Business",
      degreeReference: "AB",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Bachelor of Arts",
      degreeReference: "AB",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Associate of Business Administration",
      degreeReference: "ABA",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Bachelor of Liberal Arts",
      degreeReference: "ABL",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Associate Degree",
      degreeReference: "AD",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate Degree of Building Design",
      degreeReference: "ADBLDGDES",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate Degree of Building Surveying",
      degreeReference: "ADBLDGSURV",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate Degree of Business",
      degreeReference: "ADBUS",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate Degree of Engineering",
      degreeReference: "ADENG",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate Degree of Information Technology",
      degreeReference: "ADIT",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate Degree of Journalism",
      degreeReference: "ADJOUR",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate Degree of Learning Management",
      degreeReference: "ADLM",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate Degree of Multimedia Studies",
      degreeReference: "ADMMST",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate Degree in Nursing",
      degreeReference: "ADN",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate of Engineering",
      degreeReference: "AE",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Alternate Entry Master of Science in Nursing",
      degreeReference: "AEMSN",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Associate of Engineering Science",
      degreeReference: "AES",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate in Engineering Technology",
      degreeReference: "AET",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate of Forestry",
      degreeReference: "AF",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate of Fine Arts",
      degreeReference: "AFA",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate of General Studies",
      degreeReference: "AGS",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate of Industrial Technology",
      degreeReference: "AIT",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Master of Liberal Arts",
      degreeReference: "ALM",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Associate in Medical Science",
      degreeReference: "AMSC",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate of Nursing",
      degreeReference: "AN",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate in Occupational Studies",
      degreeReference: "AOS",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate in Occupational Technology",
      degreeReference: "AOT",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate of Public Service",
      degreeReference: "APS",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate of Political science",
      degreeReference: "APS",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate in Physical Therapy",
      degreeReference: "APT",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate of Science",
      degreeReference: "AS",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate of Science in Dental Hygiene",
      degreeReference: "ASDN",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate of Science in Nursing",
      degreeReference: "ASN",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate in Physical Therapy",
      degreeReference: "ASPT",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate Degree of Computing",
      degreeReference: "ASSOCDEGCOMP",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate Degree of Technology",
      degreeReference: "ASSOCDEGTECH",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate Degree of Technology Management",
      degreeReference: "ASSOCDEGTECHMGT",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Associate of Technology",
      degreeReference: "AT",
      degreeLevel: "associate"
    },
    {
      degreeTitle: "Doctor of Audiology",
      degreeReference: "AUD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Bachelor of Arts",
      degreeReference: "BA",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Applied Arts",
      degreeReference: "BAA",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Applied Arts and Sciences",
      degreeReference: "BAAS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Arts in Communication",
      degreeReference: "BACOM",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Aerospace Engineering",
      degreeReference: "BAE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Arts and Economics",
      degreeReference: "BAE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Economics",
      degreeReference: "BAECON",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Arts in Education",
      degreeReference: "BAED",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Applied Studies",
      degreeReference: "BAS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Applied Science",
      degreeReference: "BAS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Architectural Studies",
      degreeReference: "BAS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Applied Science",
      degreeReference: "BASC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Art & Technology",
      degreeReference: "BAT",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Applied Technology",
      degreeReference: "BATECH",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Accountancy",
      degreeReference: "BACC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Agricultural Science",
      degreeReference: "BAGRSC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Applied Finance",
      degreeReference: "BAPPFIN",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Applied Science",
      degreeReference: "BAPPSC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Architecture",
      degreeReference: "BARCH",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Asian Studies",
      degreeReference: "BAS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Business Analysis - Financial",
      degreeReference: "BBAFIN",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Business Administration",
      degreeReference: "BBA",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Built Environment",
      degreeReference: "BBE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Biosystems Engineering",
      degreeReference: "BBE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Behavioural Neuroscience",
      degreeReference: "BBNSC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Business",
      degreeReference: "BBUS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Commerce and Administration",
      degreeReference: "BCA",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Civil Engineering",
      degreeReference: "BCE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Computer Information Systems",
      degreeReference: "BCIS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Criminal Justice",
      degreeReference: "BCJ",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Computer and Mathematical Sciences",
      degreeReference: "BCM",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Computing & Mathematical Sciences",
      degreeReference: "BCMS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Surgery",
      degreeReference: "BCH",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Chemical Engineering",
      degreeReference: "BCHEE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Commerce",
      degreeReference: "BCOM",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Commerce",
      degreeReference: "BCOMM",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Communication",
      degreeReference: "BCOMN",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Computing",
      degreeReference: "BCOMP",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Computer Operations Technology",
      degreeReference: "BCOT",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Communications Studies",
      degreeReference: "BCS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Design",
      degreeReference: "BDES",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Engineering",
      degreeReference: "BE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Electrical Engineering",
      degreeReference: "BEE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Electronics Engineering Technology",
      degreeReference: "BEET",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Environmental Studies",
      degreeReference: "BES",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Economics",
      degreeReference: "BEC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Finance & Economics",
      degreeReference: "BECONFIN",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Economic Science",
      degreeReference: "BECONSC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Education",
      degreeReference: "BED",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Environmental Design",
      degreeReference: "BEND",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Engineering",
      degreeReference: "BENG",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Fine Arts",
      degreeReference: "BFA",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Finance",
      degreeReference: "BFIN",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of General Studies",
      degreeReference: "BGS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Game & Simulation Programming",
      degreeReference: "BGSP",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Humanities and Arts",
      degreeReference: "BHA",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Hotel Management",
      degreeReference: "BHM",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Health Science",
      degreeReference: "BHS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Health Sciences",
      degreeReference: "BHSC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Interior Architecture",
      degreeReference: "BIARCH",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Integrated Studies",
      degreeReference: "BIS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Interdisciplinary Studies",
      degreeReference: "BIS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Industrial and Science Engineering",
      degreeReference: "BISE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Information Technology",
      degreeReference: "BIT",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Industrial Design",
      degreeReference: "BINDSN",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Information Science",
      degreeReference: "BINFSCI",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Information Technology",
      degreeReference: "BINFTECH",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of International Studies",
      degreeReference: "BINTST",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Journalism",
      degreeReference: "BJ",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Liberal Arts",
      degreeReference: "BLA",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Landscape Architecture",
      degreeReference: "BLARCH",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Liberal Studies",
      degreeReference: "BLS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Languages",
      degreeReference: "BLANG",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Music",
      degreeReference: "BM",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Mechanical Engineering",
      degreeReference: "BME",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Music Education",
      degreeReference: "BMED",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Materials Engineering",
      degreeReference: "BMTLE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Music",
      degreeReference: "BMUS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Public Affairs",
      degreeReference: "BPA",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Polymer and Fiber Engineering",
      degreeReference: "BPFE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Professional Health Science",
      degreeReference: "BPHS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science",
      degreeReference: "BS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Aerospace Engineering",
      degreeReference: "BSAE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Business Administration",
      degreeReference: "BSBA",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Biomedical Engineering",
      degreeReference: "BSBME",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Commerce Business Administration",
      degreeReference: "BSCBA",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Civil Engineering",
      degreeReference: "BSCE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Computer & Information Sciences",
      degreeReference: "BSCIS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Computer Science",
      degreeReference: "BSCS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Computer Technology",
      degreeReference: "BSCT",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Chemical Engineering",
      degreeReference: "BSCHEE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Chemistry",
      degreeReference: "BSCHEM",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Engineering",
      degreeReference: "BSE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Electrical Engineering",
      degreeReference: "BSEE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Engineering Technology",
      degreeReference: "BSET",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Education",
      degreeReference: "BSED",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Geology",
      degreeReference: "BSGEO",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Human Environmental Sciences",
      degreeReference: "BSHES",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Mechanical Engineering",
      degreeReference: "BSME",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Manufacturing Engineering Technology",
      degreeReference: "BSMFT",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Metallurgical Engineering",
      degreeReference: "BSMET",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Microbiology",
      degreeReference: "BSMICR",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Materials Engineering",
      degreeReference: "BSMTE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Nursing",
      degreeReference: "BSN",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Social Work",
      degreeReference: "BSSW",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Social Work",
      degreeReference: "BSW",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Software Engineering",
      degreeReference: "BSWE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Textile Engineering",
      degreeReference: "BTE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Technical & Interdisciplinary Studies",
      degreeReference: "BTIS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Textile Management and Technology",
      degreeReference: "BTMT",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Wireless Engineering",
      degreeReference: "BWE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Arts",
      degreeReference: "BA",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Economics",
      degreeReference: "BAECON",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Education",
      degreeReference: "BAED",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Arts and Economics",
      degreeReference: "BAE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Journalism",
      degreeReference: "BAJ",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Architecture",
      degreeReference: "BARCH",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Applied Science",
      degreeReference: "BAS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Applied Studies",
      degreeReference: "BAS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Applied Science",
      degreeReference: "BASC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Arts for Teaching",
      degreeReference: "BAT",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Aviation",
      degreeReference: "BAVN",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Biomedical Science",
      degreeReference: "BBIOMEDSC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Business Information Systems",
      degreeReference: "BBIS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Surgery",
      degreeReference: "BC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Surgery",
      degreeReference: "BCH",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Dental Surgery",
      degreeReference: "BCHD",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Surgery Degree",
      degreeReference: "BCHIR",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Civil Law",
      degreeReference: "BCL",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Counseling",
      degreeReference: "BCOUN",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Divinity",
      degreeReference: "BD",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Divisionnity",
      degreeReference: "BD",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Design",
      degreeReference: "BDES",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Dental Surgery",
      degreeReference: "BDS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Dental Science",
      degreeReference: "BDSC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Engineering",
      degreeReference: "BE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Economics",
      degreeReference: "BECON",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Economics and Finance",
      degreeReference: "BECONFIN",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Education",
      degreeReference: "BED",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Engineering",
      degreeReference: "BENG",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Fine Arts",
      degreeReference: "BFA",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Finance",
      degreeReference: "BFIN",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of General Studies",
      degreeReference: "BGS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Health & Physical Education",
      degreeReference: "BHPE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Health Science",
      degreeReference: "BHS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Health Science",
      degreeReference: "BHSC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "bachelor of hygiene",
      degreeReference: "BHYG",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Information and Communications Technology",
      degreeReference: "BICT",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Integrated Studies",
      degreeReference: "BIS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Journalism",
      degreeReference: "BJ",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Kinesiology",
      degreeReference: "BKIN",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Liberal Arts",
      degreeReference: "BLA",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Landscape Architecture",
      degreeReference: "BLARCH",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Music (degree)",
      degreeReference: "BM",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Medicine",
      degreeReference: "BM",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Biomedical science",
      degreeReference: "BMEDSC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Medical Science",
      degreeReference: "BMEDSC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Medical Science",
      degreeReference: "BMEDSCI",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Midwifery",
      degreeReference: "BMID",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Ministry",
      degreeReference: "BMIN",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Medical Science",
      degreeReference: "BMS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Biomedical science",
      degreeReference: "BMSC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Medical Science",
      degreeReference: "BMSC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Music",
      degreeReference: "BMUS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Nursing",
      degreeReference: "BN",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Nursing Science",
      degreeReference: "BNSC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Nursing",
      degreeReference: "BNURS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Physical Education",
      degreeReference: "BPE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Pharmacy",
      degreeReference: "BPHARM",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Philosophy",
      degreeReference: "BPHIL",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "bachelor of public health nursing",
      degreeReference: "BPHN",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Professional Studies",
      degreeReference: "BPS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Religious Education",
      degreeReference: "BRE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Religious Studies",
      degreeReference: "BRS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science (clear in education line)",
      degreeReference: "BS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Education",
      degreeReference: "BSINED",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Business Administration",
      degreeReference: "BSBA",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science (university degree)",
      degreeReference: "BSC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science and/with Education",
      degreeReference: "BSCED",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Economics",
      degreeReference: "BSCECON",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Engineering",
      degreeReference: "BSCENG",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Psychology",
      degreeReference: "BSCPSYCH",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Nursing Science",
      degreeReference: "BSCN",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Education",
      degreeReference: "BSE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Engineering",
      degreeReference: "BSE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Education",
      degreeReference: "BSED",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Environmental Health",
      degreeReference: "BSEH",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Engineering Technology",
      degreeReference: "BSET",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Family and Consumer Sciences",
      degreeReference: "BSFC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in General Studies",
      degreeReference: "BSGS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Journalism",
      degreeReference: "BSJ",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Law",
      degreeReference: "BSL",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Medicine",
      degreeReference: "BSM",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Nursing",
      degreeReference: "BSN",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Nuclear Engineering",
      degreeReference: "BSNE",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Social Science",
      degreeReference: "BSOCSC",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Science in Public Health",
      degreeReference: "BSPH",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Social Work",
      degreeReference: "BSW",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Teaching",
      degreeReference: "BTCHG",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Technology",
      degreeReference: "BTECH",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Theology",
      degreeReference: "BTH",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Theology",
      degreeReference: "BTHEOL",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Veterinary Medicine",
      degreeReference: "BVETMED",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Veterinary Medicine and Science",
      degreeReference: "BVMS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Surgery",
      degreeReference: "CB",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Bachelor of Surgery",
      degreeReference: "CHB",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Doctor of Surgery",
      degreeReference: "CHD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Master in Surgery",
      degreeReference: "CM",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Doctor of Arts",
      degreeReference: "DA",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Applied Science",
      degreeReference: "DAS",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Architecture",
      degreeReference: "DARCH",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Business Administration",
      degreeReference: "DBA",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Criminal Justice",
      degreeReference: "DCJ",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Comparative Law",
      degreeReference: "DCL",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Civil Law",
      degreeReference: "DCL",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Computer Science",
      degreeReference: "DCS",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Chemistry",
      degreeReference: "DCHEM",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Criminology",
      degreeReference: "DCRIM",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Engineering Science",
      degreeReference: "DESC",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Engineering",
      degreeReference: "DENG",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Environmental Science and Engineering",
      degreeReference: "DENV",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Forestry",
      degreeReference: "DF",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Fine Arts",
      degreeReference: "DFA",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Geological Science",
      degreeReference: "DGS",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Health Education",
      degreeReference: "DHED",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Hebrew Literature/Letters",
      degreeReference: "DHL",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Health and Safety",
      degreeReference: "DHS",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Hebrew Studies",
      degreeReference: "DHS",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Humane Letters",
      degreeReference: "DHUMLITT",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Information Technology",
      degreeReference: "DIT",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Industrial Technology",
      degreeReference: "DIT",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Law and Policy",
      degreeReference: "DLP",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Library Science",
      degreeReference: "DLS",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Literature and Philosophy",
      degreeReference: "DLITTETPHIL",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Ministry",
      degreeReference: "DM",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Musical Arts",
      degreeReference: "DMA",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Musical Education",
      degreeReference: "DME",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Modern Languages",
      degreeReference: "DML",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Medical Science",
      degreeReference: "DMSC",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Music Therapy",
      degreeReference: "DMT",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Ministry",
      degreeReference: "DMIN",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Music",
      degreeReference: "DMUS",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Naprapathic Medicine",
      degreeReference: "DN",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Nursing Science",
      degreeReference: "DNS",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Nursing Science",
      degreeReference: "DNSC",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Public Administration",
      degreeReference: "DPA",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Physical Education",
      degreeReference: "DPE",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Public Health",
      degreeReference: "DPH",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Professional Studies",
      degreeReference: "DPS",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Physical Therapy",
      degreeReference: "DPT",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Recreation",
      degreeReference: "DR",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Recreation",
      degreeReference: "DREC",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Sacred Music",
      degreeReference: "DSM",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Social Science",
      degreeReference: "DSSC",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Social Work",
      degreeReference: "DSW",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Science",
      degreeReference: "DSC",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Science in Dentistry",
      degreeReference: "DSCD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Science and Hygiene",
      degreeReference: "DSCH",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Science in Veterinary Medicine",
      degreeReference: "DSCVM",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Business Administration",
      degreeReference: "DBA",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Chiropractic",
      degreeReference: "DC",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Surgery",
      degreeReference: "DCH",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Civil Law",
      degreeReference: "DCL",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Clinical Psychology",
      degreeReference: "DCLINPSYCH",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Divinitatis Doctor",
      degreeReference: "DD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Divisionnity",
      degreeReference: "DD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Divisionnitatis Doctor",
      degreeReference: "DD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Divinity",
      degreeReference: "DD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Dental Surgery",
      degreeReference: "DDS",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Dental Science",
      degreeReference: "DDSC",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Literature",
      degreeReference: "DLIT",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Letters",
      degreeReference: "DLITT",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Medicine",
      degreeReference: "DM",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Dental Medicine",
      degreeReference: "DMD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Medical Education",
      degreeReference: "DME",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Ministry",
      degreeReference: "DMIN",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Medical Science",
      degreeReference: "DMSC",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Medical Technology",
      degreeReference: "DMT",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Music",
      degreeReference: "DMUS",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Veterinary Medicine",
      degreeReference: "DMV",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Nursing",
      degreeReference: "DN",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Nursing Education",
      degreeReference: "DNE",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Nursing Science",
      degreeReference: "DNS",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Nursing Science",
      degreeReference: "DNSC",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Nursing Science",
      degreeReference: "DNURSSCI",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Osteopathy",
      degreeReference: "DO",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Ocular Science",
      degreeReference: "DOS",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Pharmacy",
      degreeReference: "DP",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Public Health",
      degreeReference: "DPH",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Philosophy",
      degreeReference: "DPHIL",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Public Health Nursing",
      degreeReference: "DPHN",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Pediatric Medicine",
      degreeReference: "DPM",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Professional Studies",
      degreeReference: "DPROF",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Practical Theology",
      degreeReference: "DPT",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Design",
      degreeReference: "DRDES",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Public Health",
      degreeReference: "DRPH",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Science",
      degreeReference: "DS",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Science",
      degreeReference: "DSC",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Social Work",
      degreeReference: "DSW",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of the University",
      degreeReference: "DUNIV",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Veterinary Medicine",
      degreeReference: "DVM",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Veterinary Medicine & Surgery",
      degreeReference: "DVMS",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Veterinary Radiology",
      degreeReference: "DVR",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Veterinary Science",
      degreeReference: "DVS",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Education",
      degreeReference: "EDD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Bachelor of Education",
      degreeReference: "EDB",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Doctor of Education",
      degreeReference: "EDD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Engineering",
      degreeReference: "ENGD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Canon Law",
      degreeReference: "JCD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Juris Doctor",
      degreeReference: "JD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Juridical Science",
      degreeReference: "JSD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Law and Policy",
      degreeReference: "LPD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of the Science of Law",
      degreeReference: "LSCD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "doctor of letters",
      degreeReference: "LITTD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Master of Laws",
      degreeReference: "LLM",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Legum Baccalaureus (Latin: Bachelor Of Laws)",
      degreeReference: "LLB",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "doctor of laws",
      degreeReference: "LLD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Master of Laws",
      degreeReference: "LLM",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Licensed Master of Social Work",
      degreeReference: "LMSW",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Arts in Education",
      degreeReference: "MAED",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Doctor of Medicine",
      degreeReference: "MD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Master of Education",
      degreeReference: "MED",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Fine Arts",
      degreeReference: "MFA",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Interdisciplinary Studies",
      degreeReference: "MIS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Library and Information Science",
      degreeReference: "MLIS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Ministry",
      degreeReference: "MMIN",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Music",
      degreeReference: "MMUS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Occupational Therapy",
      degreeReference: "MOT",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science in Engineering Technology",
      degreeReference: "MSET",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science in Education",
      degreeReference: "MSED",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science in Nursing",
      degreeReference: "MSN",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Social Work",
      degreeReference: "MSW",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Urban Planning",
      degreeReference: "MUP",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Arts",
      degreeReference: "MA",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Arts in Education",
      degreeReference: "MAED",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Applied Anthropology",
      degreeReference: "MAA",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Accountancy",
      degreeReference: "MACC",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Arts in Christian Education",
      degreeReference: "MACE",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Accountancy",
      degreeReference: "MACY",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Arts in international economics and finance",
      degreeReference: "MAIEF",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Arts in International Hotel Management",
      degreeReference: "MAIHM",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Arts in Liberal Studies",
      degreeReference: "MALS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Arts Management",
      degreeReference: "MAM",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Arts in Public Service",
      degreeReference: "MAPS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Arts in Professional Writing",
      degreeReference: "MAPW",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Architecture",
      degreeReference: "MARCH",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Archival Studies",
      degreeReference: "MAS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Engineering",
      degreeReference: "MASC",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Applied Sciences",
      degreeReference: "MASC",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Arts and Teaching",
      degreeReference: "MAT",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Bachelor of Medicine",
      degreeReference: "MB",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Master of Business Administration",
      degreeReference: "MBA",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Medicinae Baccalaureus, Baccalaureus Chirurgiae (Latin: Bachelor of Medicine, Bachelor of Surgery)",
      degreeReference: "MBBS",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Master of Biochemistry",
      degreeReference: "MBIOCHEM",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Biology",
      degreeReference: "MBIOL",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Biological Science",
      degreeReference: "MBIOLSCI",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Surgery",
      degreeReference: "MC",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Surgery",
      degreeReference: "MCH",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Chemistry",
      degreeReference: "MCHEM",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Criminal Justice",
      degreeReference: "MCJ",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Clinical Dentistry",
      degreeReference: "MCLINDENT",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Clinical Medical Science",
      degreeReference: "MCMSC",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Doctor of Medicine",
      degreeReference: "MD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Master of Divisionnity",
      degreeReference: "MDIV",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Divinity",
      degreeReference: "MDIV",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Digital Media",
      degreeReference: "MDM",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Drama",
      degreeReference: "MDRAMA",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Dental Surgery",
      degreeReference: "MDS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Engineering",
      degreeReference: "ME",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Electronic Business",
      degreeReference: "MEB",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Economics",
      degreeReference: "MECON",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Education",
      degreeReference: "MED",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Environmental Design",
      degreeReference: "MEDES",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Engineering",
      degreeReference: "MENG",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Environmental Science",
      degreeReference: "MENVSCI",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Environmental Studies",
      degreeReference: "MES",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Earth Science",
      degreeReference: "MESCI",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Educational Technology",
      degreeReference: "MET",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Fine Art",
      degreeReference: "MFA",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Forensic Sciences",
      degreeReference: "MFS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Geography",
      degreeReference: "MGEOG",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Geology",
      degreeReference: "MGEOL",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Geophysics",
      degreeReference: "MGEOPHYS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Health Administration",
      degreeReference: "MHA",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Health Education",
      degreeReference: "MHE",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Health Science",
      degreeReference: "MHS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Industrial Design",
      degreeReference: "MID",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of International Development",
      degreeReference: "MID",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Management in the Network Economy",
      degreeReference: "MINE",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Informatics",
      degreeReference: "MINF",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Engineering",
      degreeReference: "MING",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Information Systems Management",
      degreeReference: "MISM",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Jurisprudence",
      degreeReference: "MJUR",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Labor and Human Resources",
      degreeReference: "MLHR",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Librarianship",
      degreeReference: "MLIB",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Library and Information Science degree",
      degreeReference: "MLIS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Letters",
      degreeReference: "MLITT",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Library Science",
      degreeReference: "MLS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Liberal Studies",
      degreeReference: "MLS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Music",
      degreeReference: "MM",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Mathematics",
      degreeReference: "MMATH",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Mathematics and Physics",
      degreeReference: "MMATHPHYS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Mass Communications",
      degreeReference: "MMC",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Music Education",
      degreeReference: "MME",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Ministry",
      degreeReference: "MMIN",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Mathematics, Operational Research, Statistics and Economics",
      degreeReference: "MMORSE",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Marketing Research",
      degreeReference: "MMR",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Medical Science",
      degreeReference: "MMS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Medical Science",
      degreeReference: "MMSC",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Management Sciences",
      degreeReference: "MMSC",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Music",
      degreeReference: "MMUS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Nursing",
      degreeReference: "MN",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Natural Science",
      degreeReference: "MNATSC",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science in Nursing",
      degreeReference: "MNUR",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Nursing Science",
      degreeReference: "MNURSSCI",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Oceanography",
      degreeReference: "MOCEAN",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Occupational Therapy",
      degreeReference: "MOT",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Pharmacy Administration",
      degreeReference: "MPA",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Public Administration",
      degreeReference: "MPA",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Professional Accountancy",
      degreeReference: "MPA",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Physician Assistant Studies",
      degreeReference: "MPAS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Pharmacy",
      degreeReference: "MPH",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Public Health",
      degreeReference: "MPH",
      degreeLevel: "master"
    },
    {
      degreeTitle: "master of pharmacy",
      degreeReference: "MPHARM",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Philosophy",
      degreeReference: "MPHIL",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Physics",
      degreeReference: "MPHYS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Pacific International Affairs",
      degreeReference: "MPIA",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Planning",
      degreeReference: "MPLAN",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Project Management",
      degreeReference: "MPM",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Public Management",
      degreeReference: "MPM",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Public Policy",
      degreeReference: "MPP",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Professional Studies",
      degreeReference: "MPROFSTUDS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Professional Studies",
      degreeReference: "MPS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Physical Therapy",
      degreeReference: "MPT",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Radiology",
      degreeReference: "MRAD",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Research",
      degreeReference: "MRES",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science",
      degreeReference: "MS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Surgery",
      degreeReference: "MS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science in Education",
      degreeReference: "MSED",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Surgery",
      degreeReference: "MSC",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science",
      degreeReference: "MSC",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master in Science",
      degreeReference: "MSCI",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science in Dentistry",
      degreeReference: "MSD",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science in Engineering",
      degreeReference: "MSE",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science in Electrical Engineering",
      degreeReference: "MSEE",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science in Environmental Health",
      degreeReference: "MSEH",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science in Finance",
      degreeReference: "MSF",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science in Information",
      degreeReference: "MSI",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science in Information Systems",
      degreeReference: "MSIS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science in Information Studies",
      degreeReference: "MSIS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Criminal Justice",
      degreeReference: "MSJA",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science in Library Science",
      degreeReference: "MSLS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Sacred Music",
      degreeReference: "MSM",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master Of Science In Nursing",
      degreeReference: "MSN",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science in Natural Sciences",
      degreeReference: "MSNS",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Social Science",
      degreeReference: "MSOCSC",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science In Organizational Leadership",
      degreeReference: "MSOL",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science in Public Health",
      degreeReference: "MSPH",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Social Science",
      degreeReference: "MSSC",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science in Strategic Leadership",
      degreeReference: "MSSL",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science in Social Work",
      degreeReference: "MSSW",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Studies",
      degreeReference: "MST",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Science in Taxation",
      degreeReference: "MST",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Statistics",
      degreeReference: "MSTAT",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Surgery",
      degreeReference: "MSURG",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Social Work",
      degreeReference: "MSW",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Theology",
      degreeReference: "MTH",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Theology",
      degreeReference: "MTHEOL",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of the University",
      degreeReference: "MUNIV",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Urban Studies",
      degreeReference: "MURB",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Master of Urban and Regional Planning",
      degreeReference: "MURP",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Doctor of Music",
      degreeReference: "MUSDOC",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Bachelor of Music",
      degreeReference: "MUSB",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Doctor of Music",
      degreeReference: "MUSD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Master of Music",
      degreeReference: "MUSM",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Doctor of Naturopathy",
      degreeReference: "ND",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Optometry",
      degreeReference: "OD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Post Master's Graduate Certificate",
      degreeReference: "PMGC",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Doctor of Pharmacy",
      degreeReference: "PD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Philosophy",
      degreeReference: "PHD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Philosophy",
      degreeReference: "PHD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Pharmacy",
      degreeReference: "PHARMD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Pharmacy",
      degreeReference: "PHARMD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Philosophy",
      degreeReference: "PHD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Psychology",
      degreeReference: "PSYD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Rehabilitation",
      degreeReference: "RHD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Juridical Science",
      degreeReference: "SJD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Sacred Theology",
      degreeReference: "STD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Bachelor of Science",
      degreeReference: "SB",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Doctor of Science",
      degreeReference: "SCD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Engineering Science",
      degreeReference: "SCDE",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Scientiar Baccalaureus, Bachelor of Science",
      degreeReference: "SCB",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Doctor of Science",
      degreeReference: "SCD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Master of Surgery",
      degreeReference: "SM",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Doctor of Social Science",
      degreeReference: "SOCSCID",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Master of Theology",
      degreeReference: "STM",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Doctor of Theology",
      degreeReference: "THD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Doctor of Practical Theology",
      degreeReference: "THPD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Bachelor of Theology",
      degreeReference: "THB",
      degreeLevel: "bachelor"
    },
    {
      degreeTitle: "Doctor of Theology",
      degreeReference: "THD",
      degreeLevel: "doctor"
    },
    {
      degreeTitle: "Master of Theology",
      degreeReference: "THM",
      degreeLevel: "master"
    },
    {
      degreeTitle: "Veterinary Medical Doctor",
      degreeReference: "VMD",
      degreeLevel: "doctor"
    }
  ]

  export default degrees;