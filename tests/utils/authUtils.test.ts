import { isUserAuthenticated, getCurrentUserData, logoutAndRedirect } from "../../src/app/utils/authUtils"

// Mock window.location
const mockLocation = {
  href: "",
}
Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
})

describe("AuthUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    mockLocation.href = ""
  })

  describe("isUserAuthenticated", () => {
    test("returns false when no tokens are stored", () => {
      expect(isUserAuthenticated()).toBe(false)
    })

    test("returns true when both access token and user data are stored", () => {
      localStorage.setItem("access_token", "fake-token")
      localStorage.setItem("user_data", JSON.stringify({ id: "1", email: "test@example.com" }))

      expect(isUserAuthenticated()).toBe(true)
    })
  })

  describe("getCurrentUserData", () => {
    test("returns null when no user data is stored", () => {
      expect(getCurrentUserData()).toBeNull()
    })

    test("returns parsed user data when stored", () => {
      const userData = { id: "1", email: "test@example.com", role: "admin" }
      localStorage.setItem("user_data", JSON.stringify(userData))

      expect(getCurrentUserData()).toEqual(userData)
    })

    test("returns null when stored data is invalid JSON", () => {
      localStorage.setItem("user_data", "invalid-json")

      expect(getCurrentUserData()).toBeNull()
    })
  })

  describe("logoutAndRedirect", () => {
    test("clears localStorage and redirects to login", () => {
      localStorage.setItem("access_token", "fake-token")
      localStorage.setItem("refresh_token", "fake-refresh-token")
      localStorage.setItem("user_data", JSON.stringify({ id: "1" }))
      localStorage.setItem("user_role", "admin")

      logoutAndRedirect()

      expect(localStorage.getItem("access_token")).toBeNull()
      expect(localStorage.getItem("refresh_token")).toBeNull()
      expect(localStorage.getItem("user_data")).toBeNull()
      expect(localStorage.getItem("user_role")).toBeNull()
      expect(mockLocation.href).toBe("https://front-loginv1.vercel.app")
    })
  })
})
