# import frappe
# from frappe import _

# @frappe.whitelist(allow_guest=True)
# def get_techfolio():
#     doc = frappe.get_single("Techfolio")
#     return {
#         "full_name":doc.full_name,
#         "role":doc.role,
#         "bio": doc.bio,
#         "profile_pic": frappe.utils.get_url(doc.profile_pic) if doc.profile_pic else None
#     }



import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_techfolio():
    doc = frappe.get_single("Techfolio")

    return {
        "full_name": doc.full_name,
        "role": doc.role,
        "bio": doc.bio,
        "profile_pic": frappe.utils.get_url(doc.profile_pic) if doc.profile_pic else None,
        "social_media": [
            {
                "platform": sm.social_media,
                "link": sm.link,
                "active": sm.active,
            }
            for sm in doc.social_media if sm.active == 1
        ],
    }

@frappe.whitelist(allow_guest=True)
def contact():
    doc = frappe.get_single("Techfolio")
    return {
        "phone" : doc.phone,
        "email": doc.email,
        "linkedin":doc.linkedin,
        "address":doc.address
    }

@frappe.whitelist(allow_guest=True)
def skills():
    doc = frappe.get_single("Techfolio")
    return {
        "skills": [
            {
                "skill_name": s.skill_name,
                "rating": s.rating,
                "logo": frappe.utils.get_url(s.logo) if s.logo else None,
                "is_active": s.is_active,
            }
            for s in (doc.skills or [])
            if s.is_active == 1
        ]
    }


import frappe
from frappe.utils import validate_email_address

@frappe.whitelist(allow_guest=True)
def submit_get_in_touch(name1: str, email: str, phone: str = None, message: str = None):
    """
    Public API to create a Get in Touch entry with just 4 fields.
    """
    if not name1 or not email:
        frappe.throw("Name and Email are required.")

    if not validate_email_address(email, throw=False):
        frappe.throw("Invalid email address.")

    doc = frappe.get_doc({
        "doctype": "Get in Touch",
        "name1": name1,
        "email": email,
        "phone": phone,
        "message": message,
    })

    doc.insert(ignore_permissions=True)

    return {"status": "success", "docname": doc.name}



@frappe.whitelist(allow_guest=True)
def experiences():
    doc = frappe.get_single("Techfolio")
    return {
        "experience": [
            {
                "company_name": e.company_name,
                "job_role": e.job_role,
                "key_skill": e.key_skill,
                "date_of_joining": e.date_of_joining,
                "is_current_company": e.is_current_company,
                "leaving_date":e.leaving_date,
                "project_description":e.project_description,
                "company_logo": frappe.utils.get_url(e.company_logo) if e.company_logo else None,
            }
            for e in (doc.experience or [])
        ]
    }

@frappe.whitelist(allow_guest=True)
def services():
    doc = frappe.get_single("Techfolio")
    return {
        "services": [
            {
                "service_name": e.service_name,
                "description": e.description,
                "logo": frappe.utils.get_url(e.logo) if e.logo else None,
            }
            for e in (doc.services or [])
        ]
    }




@frappe.whitelist(allow_guest=True)
def social_media():
    doc = frappe.get_single("Techfolio")
    rows = doc.social_media or []
    data = [
        {
            "social_media": r.social_media,
            "link": r.link,
            "is_active": r.active,  # expose as is_active for frontend consistency
        }
        for r in rows
        if getattr(r, "active", 0) == 1
    ]
    return {"social_media": data}
