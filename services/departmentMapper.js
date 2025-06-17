
/**
 * Department Mapping Service
 * Maps issue types to departments and fetches officer information
 */

// Issue type to department mapping
const ISSUE_DEPARTMENT_MAP = {
  // Water-related issues
  "water": "DJB",
  "water leakage": "DJB", 
  "water supply": "DJB",
  "sewage": "DJB",
  "drainage": "DJB",
  
  // Road and infrastructure
  "pothole": "PWD",
  "roads": "PWD",
  "streetlight": "PWD",
  "street light": "PWD",
  "light": "PWD",
  "traffic": "PWD",
  "footpath": "PWD",
  
  // Sanitation and waste
  "garbage": "MCD",
  "sanitation": "MCD",
  "waste": "MCD",
  "cleaning": "MCD",
  "park": "MCD",
  "tree": "MCD",
  
  // Default fallback
  "other": "MCD"
};

// Mock officer database - In production, this would be an API call
const OFFICER_DATABASE = {
  "DJB": {
    "New Delhi": {
      name: "Rajesh Kumar",
      designation: "Assistant Engineer",
      email: "rajesh.djb@delhi.gov.in",
      phone: "+91-11-23456789",
      zone: "Zone-1 Central Delhi"
    },
    "Connaught Place": {
      name: "Sunita Sharma", 
      designation: "Junior Engineer",
      email: "sunita.djb@delhi.gov.in",
      phone: "+91-11-23456790",
      zone: "Zone-1 Central Delhi"
    }
  },
  "PWD": {
    "New Delhi": {
      name: "Amit Singh",
      designation: "Assistant Engineer", 
      email: "amit.pwd@delhi.gov.in",
      phone: "+91-11-23456791",
      zone: "Central PWD Division"
    },
    "Connaught Place": {
      name: "Priya Gupta",
      designation: "Junior Engineer",
      email: "priya.pwd@delhi.gov.in", 
      phone: "+91-11-23456792",
      zone: "Central PWD Division"
    }
  },
  "MCD": {
    "New Delhi": {
      name: "Rohit Verma",
      designation: "Sanitary Inspector",
      email: "rohit.mcd@delhi.gov.in",
      phone: "+91-11-23456793", 
      zone: "Central MCD Zone"
    },
    "Connaught Place": {
      name: "Kavita Jain",
      designation: "Health Officer",
      email: "kavita.mcd@delhi.gov.in",
      phone: "+91-11-23456794",
      zone: "Central MCD Zone"
    }
  }
};

// Portal URLs for each department
const PORTAL_URLS = {
  "DJB": "https://djb.gov.in/online-complaints",
  "PWD": "https://pwd.delhi.gov.in/complaint-portal", 
  "MCD": "https://mcdonline.nic.in/grievance"
};

/**
 * Maps issue type to department
 * @param {string} issueType - The type of issue reported
 * @returns {string} - Department code (DJB, PWD, MCD)
 */
function mapIssueToDepartment(issueType) {
  const normalizedType = issueType.toLowerCase().trim();
  
  // Check for exact matches first
  if (ISSUE_DEPARTMENT_MAP[normalizedType]) {
    return ISSUE_DEPARTMENT_MAP[normalizedType];
  }
  
  // Check for partial matches
  for (const [keyword, department] of Object.entries(ISSUE_DEPARTMENT_MAP)) {
    if (normalizedType.includes(keyword)) {
      return department;
    }
  }
  
  // Default fallback
  return "MCD";
}

/**
 * Fetches officer information for a department and location
 * @param {string} department - Department code
 * @param {string} constituency - Location/constituency
 * @returns {Object} - Officer details
 */
async function getOfficerInfo(department, constituency = "New Delhi") {
  try {
    // In production, this would be an API call
    // const response = await fetch(`/api/officers/${department}/${constituency}`);
    // const officer = await response.json();
    
    const officer = OFFICER_DATABASE[department]?.[constituency] || 
                   OFFICER_DATABASE[department]?.["New Delhi"] ||
                   {
                     name: `${department} Officer`,
                     designation: "Officer",
                     email: `${department.toLowerCase()}.officer@delhi.gov.in`,
                     phone: "+91-11-23456789",
                     zone: `${department} Zone`
                   };
    
    return officer;
  } catch (error) {
    console.error("Error fetching officer info:", error);
    return {
      name: `${department} Officer`,
      designation: "Officer", 
      email: `${department.toLowerCase()}.officer@delhi.gov.in`,
      phone: "+91-11-23456789",
      zone: `${department} Zone`
    };
  }
}

/**
 * Gets complete department mapping for an issue
 * @param {string} issueType - Type of issue
 * @param {string} constituency - Location
 * @returns {Object} - Complete department and officer info
 */
async function getDepartmentMapping(issueType, constituency = "New Delhi") {
  const department = mapIssueToDepartment(issueType);
  const officer = await getOfficerInfo(department, constituency);
  const portalUrl = PORTAL_URLS[department];
  
  return {
    department,
    officer,
    portalUrl,
    mapping: {
      issueType,
      constituency,
      mappedAt: new Date().toISOString()
    }
  };
}

module.exports = {
  mapIssueToDepartment,
  getOfficerInfo, 
  getDepartmentMapping,
  ISSUE_DEPARTMENT_MAP,
  PORTAL_URLS
};
