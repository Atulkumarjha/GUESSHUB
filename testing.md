📋 GUESSHUB - COMPREHENSIVE TESTING PLAN
🔧 PHASE 0: PRE-TEST SETUP
Step 1: Environment Setup


# Check if all environment variables are set
# Create/verify .env.local file has:
MONGODB_URI=<your-mongodb-connection-string>
NEXTAUTH_SECRET=<your-secret>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
NEXT_PUBLIC_BASE_URL=http://localhost:3000


Step 2: Build & Start Server


# Install dependencies (if not already done)
npm install

# Check for build errors
npm run build

# If build succeeds, start development server
npm run dev

# Server should be running on http://localhost:3000


Step 3: Database Verification
Verify MongoDB connection is working
Check that collections exist or can be created
Seed some initial data if database is empty
✅ PHASE 1: AUTHENTICATION TESTING
Test 1.1: Login Flow (Unauthenticated State)
 Navigate to http://localhost:3000
 Click "Login" or navigate to /login
 Verify Google OAuth login button appears
 Expected: Should see login page with Google sign-in option
Test 1.2: Google OAuth Login
 Click "Sign in with Google"
 Complete Google authentication
 Expected: Redirect back to home page
 Expected: See your name/avatar in navigation (AuthNav component)
 Expected: "Login" button replaced with user menu
Test 1.3: Session Persistence
 Refresh the page
 Expected: Should remain logged in
 Check browser cookies for next-auth session
Test 1.4: Logout
 Click on your profile/logout button
 Expected: Logged out and redirected
 Expected: AuthNav shows "Login" button again
📊 PHASE 2: CATEGORIES TESTING
Test 2.1: View Categories
 Navigate to /categories
 Expected: See list of categories
 Expected: If no categories, see empty state
Test 2.2: Create Category (Authenticated)
 Login first
 Go to /categories
 Look for "Create Category" form/button
 Enter category name (e.g., "Sports")
 Submit the form
 Expected: Category created successfully
 Expected: New category appears in the list
 Check: Network tab shows POST to /api/categories
Test 2.3: Category API Endpoint


# Test GET categories
curl http://localhost:3000/api/categories

# Test POST category (with session cookie)
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Technology"}'


🏪 PHASE 3: MARKETS TESTING
Test 3.1: View Markets List
 Navigate to /markets
 Expected: See list of markets
 Expected: Each market shows:
Title
Category
YES/NO prices (LMSR calculated)
End date
Liquidity
 Expected: If no markets, see appropriate message
Test 3.2: Markets Filtering & Sorting
 Test search functionality (if available)
 Test category filter
 Test sorting options:
 Ending Soon
 Recent
 By Liquidity
 By YES Price
 Expected: Markets update based on filters
Test 3.3: Trending Markets Section
 Check if trending markets appear at top
 Expected: Shows top 5 markets with 24h volume
 Expected: Sorted by trading activity
Test 3.4: Market Creation (Admin/Authenticated)
 Navigate to /admin or market creation page
 Fill in market details:
 Title
 Description
 Category (select from dropdown)
 End Date
 Initial liquidity (default 1000)
 Submit form
 Expected: Market created with:
Status: "open"
Outcome: "pending"
Pool initialized (qyes=0, qNo=0, b=100)
YES/NO prices at 50%
 Check: New market appears in /markets
📈 PHASE 4: MARKET DETAIL & TRADING
Test 4.1: View Market Detail
 Click on any market from /markets
 Navigate to /markets/[id]
 Expected: See market detail page with:
 Market status badge (🟢 Active / ⏳ Closed / ✅ Resolved)
 Title & description
 LMSR YES/NO prices (as percentages)
 Pool information (qyes, qNo, b)
 Total liquidity
 Total traders count
 24h volume
 End date
 Recent trades list
Test 4.2: User Position Display (If User Has Position)
 If you have a position in this market, verify:
 Shows "Your Position" card
 Displays outcome (YES/NO) and shares
 Shows current value (shares × current price)
 Shows potential payout if market is open
 Shows win/loss result if market is resolved
Test 4.3: Place a Bet (LMSR Trading)
 Prerequisites: Be logged in with sufficient balance
 On market detail page, look for bet/trade form
 Select outcome (YES or NO)
 Enter number of shares (e.g., 10)
 Expected: See cost calculation using LMSR
 Submit the trade
 Expected:
 Transaction succeeds
 Balance deducted
 Position created/updated
 Market prices update (pool rebalances)
 Trade appears in "Recent Trades"
 Your position card appears/updates
Test 4.4: LMSR Price Calculation
 Make multiple trades on same market
 Expected: Prices adjust dynamically
 Buy YES → YES price increases, NO decreases
 Buy NO → NO price increases, YES decreases
 Verify: YES% + NO% ≈ 100%
Test 4.5: Insufficient Balance
 Try to place bet larger than your balance
 Expected: Error message "Insufficient Balance"
 Expected: Transaction rejected
Test 4.6: Trading on Closed Market
 Try to trade on a market past end date
 Expected: "Trading closed" message
 Expected: Bet buttons disabled or hidden
💼 PHASE 5: PORTFOLIO TESTING
Test 5.1: View Portfolio
 Navigate to /portfolio
 Expected: See all your positions across markets
 For each position, verify:
 Market title (clickable link)
 Outcome (YES/NO)
 Number of shares
 Average price paid
 Current value
 P&L (Profit/Loss) calculation
Test 5.2: Empty Portfolio
 Test with a fresh account (no positions)
 Expected: "You have no open positions" message
Test 5.3: Portfolio API


# Test portfolio endpoint (needs authentication)
curl http://localhost:3000/api/portfolio \
  -H "Cookie: next-auth.session-token=<your-session-token>"


👤 PHASE 6: PROFILE TESTING
Test 6.1: View Profile
 Navigate to /protected/profile
 Expected: See your trade history
 Expected: List of all trades with:
 Market name
 Side (YES/NO)
 Shares
 Price
 Date/time
Test 6.2: Profile Protection
 Logout
 Try to access /protected/profile
 Expected: Redirect to login or see unauthorized message
🏆 PHASE 7: LEADERBOARD TESTING
Test 7.1: View Leaderboard
 Navigate to /leaderboard
 Expected: See ranked list of users
 For each user, verify:
 Rank number
 User name and avatar (Image component)
 Balance
 EV (Expected Value from open positions)
 Net Worth (Balance + EV)
Test 7.2: Leaderboard Sorting
 Expected: Users sorted by Net Worth (descending)
 Top user has highest net worth
Test 7.3: Leaderboard API


curl http://localhost:3000/api/leaderboard


⚙️ PHASE 8: ADMIN FUNCTIONS
Test 8.1: Access Admin Panel
 Navigate to /admin
 Expected: See list of markets (or admin dashboard)
 Note: Check if role-based access is enforced
Test 8.2: Resolve Market
 Navigate to /admin/markets/[id]
 For a closed/expired market:
 Select winner (YES or NO)
 Submit resolution
 Expected:
 Market status → "resolved"
 Market outcome → selected winner
 Users with winning positions get payouts
 User balances updated (1 token per winning share)
Test 8.3: Verify Payout Distribution
 Check winning user's balance increased
 Check losing user's balance unchanged (already spent on shares)
 Navigate to winner's profile
 Expected: See payout in trade history or balance
Test 8.4: Resolution API


# Test resolve endpoint
curl -X POST http://localhost:3000/api/markets/[market-id]/resolve \
  -F "winner=yes"


🔌 PHASE 9: API ENDPOINTS TESTING
Test 9.1: Health Check


curl http://localhost:3000/api/ping
# Expected: "pong" or success response


Test 9.2: Markets API


# GET all markets
curl http://localhost:3000/api/markets

# GET single market
curl http://localhost:3000/api/markets/[market-id]

# GET with filters
curl "http://localhost:3000/api/markets?category=sports&sort=recent"


Test 9.3: Trade/Bet API


# POST bet (needs authentication)
curl -X POST http://localhost:3000/api/markets/[id]/bet \
  -H "Content-Type: application/json" \
  -d '{"outcome":"yes","shares":5}'

  
🎨 PHASE 10: UI/UX TESTING
Test 10.1: Responsive Design
 Test on desktop (full width)
 Test on tablet (medium width)
 Test on mobile (small width)
 Expected: UI adapts properly, no overflow
Test 10.2: Navigation
 Test all nav links:
 Home (/)
 Markets (/markets)
 Categories (/categories)
 Leaderboard (/leaderboard)
 Portfolio (/portfolio)
 Profile (/protected/profile)
 Expected: All links work, no 404 errors
Test 10.3: Dark Theme
 Verify dark theme is applied globally
 Check text readability
 Check contrast on all elements
Test 10.4: Loading States
 Check for loading indicators during:
 API calls
 Page navigation
 Form submissions
Test 10.5: Error Messages
 Verify user-friendly error messages for:
 Network failures
 Invalid inputs
 Authentication errors
 Insufficient balance
🐛 PHASE 11: EDGE CASES & ERROR HANDLING
Test 11.1: Invalid Market ID
 Navigate to /markets/invalid-id-123
 Expected: "Market not found" message
Test 11.2: Expired Markets
 View a market past its end date
 Expected: Status shows "closed"
 Expected: Trading disabled
Test 11.3: Zero Balance Trading
 Deplete user balance to 0
 Try to place any bet
 Expected: "Insufficient balance" error
Test 11.4: Concurrent Trading
 Open same market in two tabs
 Place trades from both tabs quickly
 Expected: Both succeed or one fails gracefully
Test 11.5: Database Disconnection
 Temporarily stop MongoDB
 Try any database operation
 Expected: Graceful error, not crash
⚡ PHASE 12: PERFORMANCE TESTING
Test 12.1: Page Load Times
 Measure load time for each page
 Expected: < 3 seconds on decent connection
Test 12.2: API Response Times
 Test API endpoints with tools (Postman, curl)
 Expected: < 500ms for simple queries
Test 12.3: Large Data Sets
 Create 50+ markets
 Place 100+ trades
 Expected: Markets page still loads quickly
 Expected: Pagination or lazy loading works
🔒 PHASE 13: SECURITY TESTING
Test 13.1: Unauthorized Access
 Logout
 Try to access protected routes directly
 Expected: Redirect or unauthorized error
Test 13.2: CSRF Protection
 Verify forms have CSRF protection
 Try API calls without proper headers
 Expected: Rejected
Test 13.3: SQL/NoSQL Injection
 Try malicious inputs in forms
 Expected: Sanitized and rejected
📝 PHASE 14: DATA INTEGRITY
Test 14.1: Balance Conservation
 Track total system balance (all users)
 Make multiple trades
 Expected: Total balance remains constant (zero-sum)
Test 14.2: Position Accuracy
 Verify position shares match trade history
 Expected: Sum of trades = current position
Test 14.3: Market Pool Integrity
 Check pool values (qyes, qNo)
 Expected: Match trade history
🧪 TESTING CHECKLIST SUMMARY
Critical Path (Must Test)
✅ Authentication (login/logout)
✅ Create market
✅ View markets list
✅ View market detail
✅ Place bet/trade
✅ View portfolio
✅ Resolve market
✅ Verify payouts
Important (Should Test)
Categories CRUD
Filtering/sorting
Leaderboard
Profile/trade history
Balance management
LMSR price updates
Nice to Have (Good to Test)
Responsive design
Error handling
Performance
Security
🚀 GETTING STARTED - QUICK TEST SEQUENCE
📊 TEST RESULT TRACKING
Create a simple spreadsheet or checklist with columns:

Test ID
Test Name
Status (Pass/Fail/Skip)
Notes
Screenshot (if bug)
This comprehensive testing plan covers all major features and edge cases in your GuessHub application. Start with Phase 0-1, then proceed through each phase systematically. Good luck testing! 🎯

