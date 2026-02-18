export async function getStates(params = {}) {
  try {
    const url = new URL(`${process.env.HOST}/api/states`);

    // Add query parameters if provided
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const res = await fetch(url.toString(), {
      cache: "no-store", // always fresh data, use "force-cache" if data rarely changes
    });

    if (!res.ok)
      return {
        error: `Failed to fetch states: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    if (data?.allStates) {
      return data.allStates;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getStates error:", error);
    return [];
  }
}

export async function getDistricts(params = {}) {
  try {
    const url = new URL(`${process.env.HOST}/api/districts`);

    // Add query parameters if provided
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const res = await fetch(url.toString(), {
      cache: "no-store", // always fresh data, use "force-cache" if data rarely changes
    });

    if (!res.ok)
      return {
        error: `Failed to fetch states: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    // If allDistricts array exists, return it (multiple districts)
    // Otherwise return the single district object
    if (data?.allDistricts) {
      return data.allDistricts;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getDistricts error:", error);
    return [];
  }
}

export async function getTehsils(params = {}) {
  try {
    const url = new URL(`${process.env.HOST}/api/tehsil`);

    // Add query parameters if provided
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const res = await fetch(url.toString(), {
      cache: "no-store", // always fresh data, use "force-cache" if data rarely changes
    });

    if (!res.ok)
      return {
        error: `Failed to fetch states: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    // If allTehsils array exists, return it (multiple tehsils)
    // Otherwise return the single tehsil object
    if (data?.allTehsils) {
      return data.allTehsils;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getTehsils error:", error);
    return [];
  }
}

export async function getVillages(params = {}) {
  try {
    const url = new URL(`${process.env.HOST}/api/village`);

    // Add query parameters if provided
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const res = await fetch(url.toString(), {
      cache: "no-store", // always fresh data, use "force-cache" if data rarely changes
    });

    if (!res.ok)
      return {
        error: `Failed to fetch states: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    // If allVillages array exists, return it (multiple villages)
    // Otherwise return the single village object
    if (data?.allVillages) {
      return data.allVillages;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getVillages error:", error);
    return [];
  }
}
