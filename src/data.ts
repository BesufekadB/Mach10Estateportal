/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project } from "./types";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-obsidian-pavilion",
    name: "The Obsidian Pavilion",
    location: "Amalfi Coast, Italy",
    dateAdded: "Oct 2023",
    category: "Residential",
    status: "In Progress",
    assignedClientId: "mach10media.et@gmail.com",
    thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjY0PvIWenXdIlmQSw3E0tftQLgnJ7ovBSTrRoGzmcop_RjItomBbe-jjfeKJNIOLkFRULRNltv41WHBt8WAP0zEBTsntgtzJ1xPV1ei-ys3czRxVLEI0jOmJrO6gkz7D7ReoUy_rCRsv44rwFF7uXkNpQb8WqajS9yaMfcYF_G0vHYBm2oI1eUtSqaApVXiLyPFx1Q-VkNv9bS27_87fUjgKSESkLmNSmeVCACivezmK_EpfLyIaL6rc2ASHNube1WXHXj6FnQGU",
    heroImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuASzMoDtsRjppvfiz14jD2ZX6yLcoqeSbH4h46qJ4c7MjN2fjSzihrPUzH_J5_bbtN9WG5291hgyCf9fTuJYRrERFqDAPamOH37tRPYXIuYuQn2QDXViyiMVn1CI6KER4F1Z_kau1H9bOnKPOMzPjcHI4DkLsJX2VQT_BKe7180o3Z5LtPqRbP9tAyyz5pam6kHOW19MTxq11sfVxE7rL9L9r19Ekrrru5b3chK7nrxq5TLIuiDN0-WaasndJ2U6GYJqHrvPD_g7hE",
    description: "An architectural dialogue between light and matter, situated on the pristine cliffs of the Amalfi Coast.",
    architecturalNarrative: "Defined by its uncompromising geometry and deep connection to the Mediterranean horizon, The Obsidian Pavilion represents the pinnacle of contemporary living. Every line is intentional, every surface curated to provide an immersive sensory experience that balances grand scale with intimate warmth. The interior program flows seamlessly from the triple-height gallery into the cantilevered living spaces, where floor-to-ceiling glazing dissolves the boundary between the internal sanctuary and the dramatic coastal landscape beyond.",
    specs: {
      beds: "06",
      baths: "08",
      livingArea: "12,400 SQFT",
      acreage: "2.4 ACRES",
      builtYear: "2023",
      garage: "6 Cars",
      amenities: "Wellness Wing, Infinity Pool, Wine Reserve",
      price: "Price Upon Request"
    },
    tourEmbedUrl: "",
    scenes: [
      {
        id: "scene-atelier",
        name: "Grand Atelier & Suites",
        category: "Primary Wing",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4-t6oj0GXCyMa_XxF44E8wtcoP93Js-HGRXlXbyIRXyz-o4AG-1gGjg8xIeXGxqR_ULhytC1sl4fFHkALRNfKAnM7qPg3evC3PipETpcJO5lQ2Y_9oEz4AiNQBXnKqfqBbVo28F0_OlNQ97xfJT9vS7Ta2bONxtq-Pk929qAwxfHfmPDqrIjq2yTdJe4DmE9VCfJv1bq8_PIKX0LniDlPzbXpK-Umk3A-FGtlNhY5SWLVKzfScXD8bq6jhm0FLF15txZEOq4kqiI",
        description: "Elegant bespoke interior design mirroring the Amalfi twilight with standard herringbone wood floors and floor-to-ceiling vistas."
      },
      {
        id: "scene-pool",
        name: "Infinity Horizon Pool",
        category: "Outer Terrace",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_Fp8j6bXQMD54CFDVtFimF2SkUEmOL1yL4uEGAd--E1VY4ZGR47fPzgpx3nKVCoOI5sRZ8uKSbIV8p1_HWqrAMAgYhU9tu1WkwqaKv0DlG7S7I3OGrXX-hS9PwygOuMHaMV-OCsbOS_88C0mCpxL700LJKLJh_r0Gs4mY4AeyA2DrC6XN4czRnjUIfXMdGuY3uyKEU_sLApMVH6RTSO5-SiMofaiwjoDG4JE3K6dmOiJ_lCPdj7aCYnObE6BmK6c3osfhbo0mJEk",
        description: "A 75ft custom cantilevered saltwater pool merging with the sapphire sea horizon."
      },
      {
        id: "scene-vault",
        name: "Private Reserve Vault",
        category: "Cellar Wing",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRA4NwIguMzixjq4ap5pQ4jmDgcUR9fAPCoEYUknSiUkvHtarKnregLnEaodFUFr2Cu87KhuALqIzY1ibvIqJUk5r6dePcmFSZY2EuhIE8YhF26o8auXnnSiNWGMR185SC3T7AW8Yl0yU9A5xr6IJgvk-SfQsXxQyKAIjvfM596Bznm2G1ESaaZMeHVfJi1EgMDcJ2Y_HSGq7fc-IfEnYS6sPwcTwmzd90MO5kVqAChLRBWhM5h6GcAOewm9wk2MF43By2iRZVoTE",
        description: "Highly customized climate-controlled gallery with a capacity for 2,500 premium vintages."
      },
      {
        id: "scene-spa",
        name: "Zenith Thermal Spa",
        category: "Wellness Wing",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC477gVTXZD-LIRJXQR9lokD9SPhFSSvJKx4XW3CQy2CPjpq3HYTAT_dyLplU-brBZEESgto7EC4Jg6p1rRmwOSG5gjYhzQL9nWn2-WHcPPqK3gc8DGMjHP8mEPQKv2a3bweqZrEA0MW1185U8aXTwX11vbJdORb_wlapAQXS-cVhRj6cYT5MINf4YVSaCWwVwZeqKu8w-jr9E7hTnga9n8uVgc9iHmNeGAIcxnsTSqJfGrtyuq4CxcvOWKdFevN7SwStOoVuvAtoI",
        description: "A serene marble-finished bathhouse with custom steam amenities and warm dynamic stone pillars."
      },
      {
        id: "scene-lab",
        name: "Culinary Laboratory",
        category: "Social Atrium",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3OD-b5muURizV90-d9VjhKCyZpYZL9zs_PvrjEivYGnH-vc-iNRyWllSHUVhrC_Wf-bM17GtH_GQtumHoF_IPVZxiRit14WLtgvMBaRjAg-0b0kM6LzTQfw5fMwTho6XesL4BYgzUj7qU8FAvceE6xOAqHNx5xHqDVL0Kveu29wZ7YzbsIv-ibmxU_iDOh8MXF8sR1mfY6pGD-amXweqPpP5THuuW50sPibJPWLZDR0vxtjRKRTbDxpJXJ4F7s2j4O62wdSwe3JM",
        description: "Gourmet design featuring textured charcoal woodwork, premium Monolith appliances, and a marble waterfall counter island."
      }
    ]
  },
  {
    id: "proj-azure-cove",
    name: "Azure Cove Villa",
    location: "Malibu, California",
    dateAdded: "Aug 2023",
    category: "Residential",
    status: "Finalized",
    assignedClientId: "mach10media.et@gmail.com",
    thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZfRmptaivgLBRwYaFtCCneUzua5gLIQD0eARwKogQJ9nQF02nyyPSZ6QCYWxr-8ZZgGT5DNfSoPvWmoK0qlq2WAsYcGmBT1kyQLaeeRETkmmOTbyLVL_eBSFnPUo3g3jn0Eu3egLl4IZWG5O7fqFkQpqZzW2nE4Y84_WCAg-QEVrbO-lmxZHkGu2tEFTC8I5fep363DH-BIc1Geuk6QlBzUWNkuQ7nB8qfxRja04kA5AZECRh-H67Ndfq29DdZ04OAvE_oBY-Yds",
    heroImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZfRmptaivgLBRwYaFtCCneUzua5gLIQD0eARwKogQJ9nQF02nyyPSZ6QCYWxr-8ZZgGT5DNfSoPvWmoK0qlq2WAsYcGmBT1kyQLaeeRETkmmOTbyLVL_eBSFnPUo3g3jn0Eu3egLl4IZWG5O7fqFkQpqZzW2nE4Y84_WCAg-QEVrbO-lmxZHkGu2tEFTC8I5fep363DH-BIc1Geuk6QlBzUWNkuQ7nB8qfxRja14kA5AZECRh-H67Ndfq29DdZ04OAvE_oBY-Yds",
    description: "An ultra-modern coastal villa nestled on Malibu Cliffs, celebrating geometric clarity and panoramic views.",
    architecturalNarrative: "Azure Cove Villa utilizes cantilevered glass frames and natural stone layers to float seamlessly above the surf of the Pacific Ocean. The pool integrates beautifully with outer decks, emphasizing double-height living areas and open social galleries.",
    specs: {
      beds: "05",
      baths: "06",
      livingArea: "9,800 SQFT",
      acreage: "1.2 ACRES",
      builtYear: "2022",
      garage: "4 Cars",
      amenities: "Detached Beach Cabana, Solar Atrium, Wine Gallery",
      price: "$28,500,000"
    },
    tourEmbedUrl: "",
    scenes: [
      {
        id: "azure-deck",
        name: "Cliffside Infinity Deck",
        category: "Pool Terrace",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_Fp8j6bXQMD54CFDVtFimF2SkUEmOL1yL4uEGAd--E1VY4ZGR47fPzgpx3nKVCoOI5sRZ8uKSbIV8p1_HWqrAMAgYhU9tu1WkwqaKv0DlG7S7I3OGrXX-hS9PwygOuMHaMV-OCsbOS_88C0mCpxL700LJKLJh_r0Gs4mY4AeyA2DrC6XN4czRnjUIfXMdGuY3uyKEU_sLApMVH6RTSO5-SiMofaiwjoDG4JE3K6dmOiJ_lCPdj7aCYnObE6BmK6c3osfhbo0mJEk",
        description: "Stretches outward into the ocean wind, finished in raw grey granite tiles."
      }
    ]
  },
  {
    id: "proj-7th-ave-penthouse",
    name: "7th Ave Penthouse",
    location: "New York, NY",
    dateAdded: "Jan 2024",
    category: "Residential",
    status: "Design Phase",
    assignedClientId: "mach10media.et@gmail.com",
    thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqCeGOeCArcBRhReqdpvd3PiwsttyAGnogLs49YiF_vhx3jcfD6YiETXp4iYJZMNGpP-ZqHm264oZl_xe2RA6ZMt8ZOL34_lYgaJBkyv5DwQpv4LyuepS6dJMeu9BiBzc3r9toScEdOeubjK6c2DjCnRX499exZMCJ6NrbfzgKpn3VgghTbxlu3ZV1vd2DFBMnBkts4fxLqIuT_DyKGEbgjPmjFOo-nvrZ7Yy4_0vM9S-8JcV-gthpPjd21wwGZ8-5Q5XPRD4fj7U",
    heroImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqCeGOeCArcBRhReqdpvd3PiwsttyAGnogLs49YiF_vhx3jcfD6YiETXp4iYJZMNGpP-ZqHm264oZl_xe2RA6ZMt8ZOL34_lYgaJBkyv5DwQpv4LyuepS6dJMeu9BiBzc3r9toScEdOeubjK6c2DjCnRX499exZMCJ6NrbfzgKpn3VgghTbxlu3ZV1vd2DFBMnBkts4fxLqIuT_DyKGEbgjPmjFOo-nvrZ7Yy4_0vM9S-8JcV-gthpPjd21wwGZ8-5Q5XPRD4fj7U",
    description: "A sky-high minimalist penthouse renovation hovering elegantly above the Manhattan skyline.",
    architecturalNarrative: "Located on high floors in the heart of Chelsea, this penthouse represents a transition into dark-themed, architectural serenity, utilizing raw wood panelings, minimalist slot-diffusers, and tailored frame openings.",
    specs: {
      beds: "03",
      baths: "3.5",
      livingArea: "4,200 SQFT",
      acreage: "N/A",
      builtYear: "2024",
      garage: "N/A",
      amenities: "Private Elevator Lobby, Sky Deck, Custom Sauna",
      price: "$14,200,000"
    },
    tourEmbedUrl: "",
    scenes: [
      {
        id: "7th-penthouse-salon",
        name: "Grand Salon Skylist",
        category: "Interior Saloon",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqCeGOeCArcBRhReqdpvd3PiwsttyAGnogLs49YiF_vhx3jcfD6YiETXp4iYJZMNGpP-ZqHm264oZl_xe2RA6ZMt8ZOL34_lYgaJBkyv5DwQpv4LyuepS6dJMeu9BiBzc3r9toScEdOeubjK6c2DjCnRX499exZMCJ6NrbfzgKpn3VgghTbxlu3ZV1vd2DFBMnBkts4fxLqIuT_DyKGEbgjPmjFOo-nvrZ7Yy4_0vM9S-8JcV-gthpPjd21wwGZ8-5Q5XPRD4fj7U",
        description: "Dark mahogany panels frames dramatic city perspectives."
      }
    ]
  },
  {
    id: "proj-monolith-ridge",
    name: "The Monolith Ridge",
    location: "Aspen, Colorado",
    dateAdded: "Dec 2023",
    category: "Residential",
    status: "Excavation",
    assignedClientId: "mach10media.et@gmail.com",
    thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWF2sOQiTVvyOxT6CVHi8kQoHtCs98r_O1cPY5GpPxGajMTvTDJxAvZu96vJcARj1vhVJSzC9SX2pZENU13FssaCW-yKrkYLMIsb3uXMfBmKUMxnvjo8gpHkTWF2UFlJ-uQovUcDkrCBbDJV_iI3928LVWaIwj9bWKHJq-m5fJNklmLogmwjv-RzVT9Ys-Y7YykXFSDu0prdnd7lWmZkpXPdXv7uy8E9lrgBwzq5FRios3m8wPbJOClviXI_Rzx0aZVKRDtDORuLU",
    heroImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWF2sOQiTVvyOxT6CVHi8kQoHtCs98r_O1cPY5GpPxGajMTvTDJxAvZu96vJcARj1vhVJSzC9SX2pZENU13FssaCW-yKrkYLMIsb3uXMfBmKUMxnvjo8gpHkTWF2UFlJ-uQovUcDkrCBbDJV_iI3928LVWaIwj9bWKHJq-m5fJNklmLogmwjv-RzVT9Ys-Y7YykXFSDu0prdnd7lWmZkpXPdXv7uy8E9lrgBwzq5FRios3m8wPbJOClviXI_Rzx0aZVKRDtDORuLU",
    description: "A dark mountain chalet designed to mimic natural basalt formations against snowy ski ranges.",
    architecturalNarrative: "Nestled into mountain forests, The Monolith Ridge relies on massive timber structures intersecting with local granite foundation slabs. Large panoramic double-paned glass guarantees high-discerning thermal efficiency.",
    specs: {
      beds: "06",
      baths: "07",
      livingArea: "8,400 SQFT",
      acreage: "4.5 ACRES",
      builtYear: "2024",
      garage: "3 Cars",
      amenities: "Ski-in/Ski-out, Geothermal Vault, Wine Cellar",
      price: "$19,800,000"
    },
    tourEmbedUrl: "",
    scenes: [
      {
        id: "monolith-atrium",
        name: "Lounge Hearth",
        category: "Atrium",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC477gVTXZD-LIRJXQR9lokD9SPhFSSvJKx4XW3CQy2CPjpq3HYTAT_dyLplU-brBZEESgto7EC4Jg6p1rRmwOSG5gjYhzQL9nWn2-WHcPPqK3gc8DGMjHP8mEPQKv2a3bweqZrEA0MW1185U8aXTwX11vbJdORb_wlapAQXS-cVhRj6cYT5MINf4YVSaCWwVwZeqKu8w-jr9E7hTnga9n8uVgc9iHmNeGAIcxnsTSqJfGrtyuq4CxcvOWKdFevN7SwStOoVuvAtoI",
        description: "Cozy custom sunken lounge around suspended dark iron fireplaces."
      }
    ]
  },
  {
    id: "proj-greenwich",
    name: "Greenwich Manor",
    location: "Greenwich, Connecticut",
    dateAdded: "Feb 2023",
    category: "Residential",
    status: "Occupied",
    assignedClientId: "mach10media.et@gmail.com",
    thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHc9ShH4c3EAg2P8wFplQo9K4D_Fpu9qx4iBy8ZnQszIWc9nCKkIKUfBm6HcALu4c5zFQoO5MGAWFPfE3tdrgmRC_LD0Jum24azd-oXEi7_Y8gEvqXPY0eWoJX1ADQLWV4K2AGyu4SqqaWrPkPppLHc8BSfePfe9St-DCQUczuNvWGDaCkCfV1Q360BTnKwhxFWONrlICbvISPt857qgtQni7oqDFMFDb8noKJ0RybHO605FTSiUJnuHsspyJD8t0PrUUOS1u42b4",
    heroImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHc9ShH4c3EAg2P8wFplQo9K4D_Fpu9qx4iBy8ZnQszIWc9nCKkIKUfBm6HcALu4c5zFQoO5MGAWFPfE3tdrgmRC_LD0Jum24azd-oXEi7_Y8gEvqXPY0eWoJX1ADQLWV4K2AGyu4SqqaWrPkPppLHc8BSfePfe9St-DCQUczuNvWGDaCkCfV1Q360BTnKwhxFWONrlICbvISPt857qgtQni7oqDFMFDb8noKJ0RybHO605FTSiUJnuHsspyJD8t0PrUUOS1u42b4",
    description: "A neoclassical masterpiece updated for 21st-century architectural symmetry.",
    architecturalNarrative: "Dressed in smooth white sandstones and surrounded by manicured pathways, Greenwich Manor combines classic slate pavilions with clean modern layouts.",
    specs: {
      beds: "08",
      baths: "10",
      livingArea: "15,200 SQFT",
      acreage: "5.8 ACRES",
      builtYear: "2021",
      garage: "8 Cars",
      amenities: "Symmetric Water Gardens, Tennis Pavilion, High Cellar",
      price: "$34,000,000"
    },
    tourEmbedUrl: "",
    scenes: [
      {
        id: "greenwich-foyer",
        name: "Symmetric Foyer Gallery",
        category: "Central Foyer",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHc9ShH4c3EAg2P8wFplQo9K4D_Fpu9qx4iBy8ZnQszIWc9nCKkIKUfBm6HcALu4c5zFQoO5MGAWFPfE3tdrgmRC_LD0Jum24azd-oXEi7_Y8gEvqXPY0eWoJX1ADQLWV4K2AGyu4SqqaWrPkPppLHc8BSfePfe9St-DCQUczuNvWGDaCkCfV1Q360BTnKwhxFWONrlICbvISPt857qgtQni7oqDFMFDb8noKJ0RybHO605FTSiUJnuHsspyJD8t0PrUUOS1u42b4",
        description: "Double height dome ceiling finished in white custom plaster boards."
      }
    ]
  },
  {
    id: "proj-commercial-atrium",
    name: "The Aurelian Atrium",
    location: "Zurich, Switzerland",
    dateAdded: "Nov 2023",
    category: "Commercial",
    status: "Design Phase",
    assignedClientId: "sterling@aurelian.com", // Assigned only to Mr. Sterling to showcase multi-client filtering!
    thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuASzMoDtsRjppvfiz14jD2ZX6yLcoqeSbH4h46qJ4c7MjN2fjSzihrPUzH_J5_bbtN9WG5291hgyCf9fTuJYRrERFqDAPamOH37tRPYXIuYuQn2QDXViyiMVn1CI6KER4F1Z_kau1H9bOnKPOMzPjcHI4DkLsJX2VQT_BKe7180o3Z5LtPqRbP9tAyyz5pam6kHOW19MTxq11sfVxE7rL9L9r19Ekrrru5b3chK7nrxq5TLIuiDN0-WaasndJ2U6GYJqHrvPD_g7hE",
    heroImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuASzMoDtsRjppvfiz14jD2ZX6yLcoqeSbH4h46qJ4c7MjN2fjSzihrPUzH_J5_bbtN9WG5291hgyCf9fTuJYRrERFqDAPamOH37tRPYXIuYuQn2QDXViyiMVn1CI6KER4F1Z_kau1H9bOnKPOMzPjcHI4DkLsJX2VQT_BKe7180o3Z5LtPqRbP9tAyyz5pam6kHOW19MTxq11sfVxE7rL9L9r19Ekrrru5b3chK7nrxq5TLIuiDN0-WaasndJ2U6GYJqHrvPD_g7hE",
    description: "Multi-tiered corporate headquarters celebrating glass volume and acoustic perfection.",
    architecturalNarrative: "An executive campus designed for maximum workspace light saturation, high acoustic insulation, and sustainable solar facade panels.",
    specs: {
      beds: "N/A",
      baths: "12 Offices",
      livingArea: "45,000 SQFT",
      acreage: "3.1 ACRES",
      builtYear: "2025",
      garage: "50 Spots",
      amenities: "Executive Lounge, Rooftop helipad, Acoustic pods",
      price: "$85,000,000"
    },
    scenes: [
      {
        id: "zurich-atrium",
        name: "Central Glass Atrium",
        category: "Main Core",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuASzMoDtsRjppvfiz14jD2ZX6yLcoqeSbH4h46qJ4c7MjN2fjSzihrPUzH_J5_bbtN9WG5291hgyCf9fTuJYRrERFqDAPamOH37tRPYXIuYuQn2QDXViyiMVn1CI6KER4F1Z_kau1H9bOnKPOMzPjcHI4DkLsJX2VQT_BKe7180o3Z5LtPqRbP9tAyyz5pam6kHOW19MTxq11sfVxE7rL9L9r19Ekrrru5b3chK7nrxq5TLIuiDN0-WaasndJ2U6GYJqHrvPD_g7hE",
        description: "Sunlight cascades through executive glass panels to illuminate natural oak pillars."
      }
    ]
  }
];
