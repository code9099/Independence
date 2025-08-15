
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

// Email directory (primary + cc)
const EMAIL_DIRECTORY = {
  PWD: {
    primary: [
      "einc-pwd@delhi.gov.in",
      "dirw-pwd@delhi.gov.in",
      "dirm-pwd@delhi.gov.in",
      "dirp-pwd@delhi.gov.in",
    ],
    cc: [
      "pss-pwd.minister@delhi.gov.in",
      // Zones
      "cepwddelhimzm1@gmail.com", // South
      "cepwddelhimzm2@gmail.com", // East
      "cepwddelhimzm3@gmail.com", // North
      "cepwdflyover@gmail.com",  // Flyover
    ],
  },
  MCD: {
    primary: [
      "mcd-ithelpdesk@mcd.nic.in",
      "commissioner@mcd.nic.in",
    ],
    cc: [
      "dyanccnz@mcd.org.in",
      "dyancwz@mcd.org.in",
      "dyancsz@mcd.org.in",
      "dyancngz@mcd.org.in",
    ],
  },
  DJB: {
    primary: [
      "grievances-djb@delhi.gov.in",
      "vc-djb@delhi.gov.in",
    ],
    cc: [],
  },
  ELECTRICITY: {
    primary: [
      // BRPL / BYPL / TPDDL escalation inboxes
      "brplhead.customercare@relianceada.com",
      "cgf.brpl@relianceada.com",
      "prem.r.kumar@relianceada.com",
      "customercare@tatapower-ddl.com",
      "md.office@tatapower-ddl.com",
      "cgredressal.forum@tatapower-ddl.com",
      "elect_ombudsman@yahoo.com",
    ],
    cc: [],
  },
  DTC: {
    primary: [
      "ccc@dtc.nic.in",
      "cmd@dtc.nic.in",
    ],
    cc: [
      "rmeast@dtc.nic.in",
      "rmwest@dtc.nic.in",
      "rmnorth@dtc.nic.in",
      "rmsouth@dtc.nic.in",
    ],
  },
  TRAFFIC: {
    primary: [
      "jtcpt.dtp@nic.in",
      "jtcp.transportrange@delhipolice.gov.in",
    ],
    cc: [],
  },
  NDMC: {
    primary: [
      "care@ndmc.gov.in",
      "it@ndmc.gov.in",
      "director.hl@ndmc.gov.in",
    ],
    cc: [],
  },
  POLICE: {
    primary: [
      "pca.delhi@delhi.gov.in",
      "dcp-vigilance-dl@nic.in",
    ],
    cc: [],
  },
  DDA: {
    primary: [],
    cc: [],
  },
};

function pickEmailGroup(category) {
  const key = category.toLowerCase();
  if (key.includes('water')) return EMAIL_DIRECTORY.DJB;
  if (key.includes('electric')) return EMAIL_DIRECTORY.ELECTRICITY;
  if (key.includes('pothole') || key.includes('road') || key.includes('street')) return EMAIL_DIRECTORY.PWD;
  if (key.includes('garbage') || key.includes('sanitation') || key.includes('waste')) return EMAIL_DIRECTORY.MCD;
  if (key.includes('bus') || key.includes('dtc')) return EMAIL_DIRECTORY.DTC;
  if (key.includes('traffic')) return EMAIL_DIRECTORY.TRAFFIC;
  if (key.includes('ndmc')) return EMAIL_DIRECTORY.NDMC;
  if (key.includes('police')) return EMAIL_DIRECTORY.POLICE;
  return EMAIL_DIRECTORY.MCD;
}

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
  const emailGroup = pickEmailGroup(issueType);
  let emails = {
    to: emailGroup.primary && emailGroup.primary.length ? emailGroup.primary[0] : undefined,
    cc: emailGroup.cc || [],
    all: [ ...(emailGroup.primary || []), ...(emailGroup.cc || []) ],
  };

  // Try Supabase-backed directory if configured
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseKey && typeof fetch === 'function') {
      const params = new URLSearchParams({
        select: '*',
        active: 'eq.true',
        dept_id: `eq.${department}`,
        limit: '1'
      });
      const resp = await fetch(`${supabaseUrl}/rest/v1/departments?${params.toString()}`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        }
      });
      if (resp.ok) {
        const rows = await resp.json();
        if (Array.isArray(rows) && rows.length > 0) {
          const row = rows[0];
          const primary = (row.primary_email || '').trim();
          const cc = (row.cc_emails || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
          if (primary || cc.length) {
            emails = {
              to: primary || emails.to,
              cc,
              all: [primary, ...cc].filter(Boolean)
            };
          }
        }
      } else {
        console.warn('Supabase directory fetch failed with status', resp.status);
      }
    }
  } catch (e) {
    console.warn('Supabase directory lookup skipped:', e?.message || e);
  }
  
  return {
    department,
    officer,
    portalUrl,
    emails,
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
