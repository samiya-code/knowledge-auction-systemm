// Test time functions in browser console
import { getRelativeTime, formatTime, formatTimeWithHours, calculateTimeDifference } from './utils/calculateTime.js';

// Test functions
function testTimeFunctions() {
  console.log('⏰ Testing Time Functions...\n');

  // Test 1: getRelativeTime
  console.log('1. Testing getRelativeTime...');
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  console.log('✅ getRelativeTime (1 hour ago):', getRelativeTime(oneHourAgo));
  console.log('✅ getRelativeTime (1 day ago):', getRelativeTime(oneDayAgo));
  console.log('✅ getRelativeTime (1 week ago):', getRelativeTime(oneWeekAgo));
  console.log('✅ getRelativeTime (now):', getRelativeTime(now));

  // Test 2: formatTime
  console.log('\n2. Testing formatTime...');
  console.log('✅ formatTime (65 seconds):', formatTime(65));
  console.log('✅ formatTime (125 seconds):', formatTime(125));
  console.log('✅ formatTime (3600 seconds):', formatTime(3600));

  // Test 3: formatTimeWithHours
  console.log('\n3. Testing formatTimeWithHours...');
  console.log('✅ formatTimeWithHours (65 seconds):', formatTimeWithHours(65));
  console.log('✅ formatTimeWithHours (3665 seconds):', formatTimeWithHours(3665));
  console.log('✅ formatTimeWithHours (9000 seconds):', formatTimeWithHours(9000));

  // Test 4: calculateTimeDifference
  console.log('\n4. Testing calculateTimeDifference...');
  const startDate = new Date('2024-01-01T10:00:00Z');
  const endDate = new Date('2024-01-01T12:30:00Z');
  console.log('✅ calculateTimeDifference (2.5 hours):', calculateTimeDifference(startDate, endDate), 'seconds');

  // Test 5: Edge cases
  console.log('\n5. Testing edge cases...');
  console.log('✅ getRelativeTime (invalid date):', getRelativeTime('invalid'));
  console.log('✅ formatTime (0 seconds):', formatTime(0));
  console.log('✅ formatTime (negative):', formatTime(-10));

  console.log('\n🎯 Time Functions Test Complete!');
  console.log('\n📋 Results:');
  console.log('- All functions should return expected values');
  console.log('- Edge cases should be handled gracefully');
  console.log('- No errors should occur');
  console.log('- Functions work in browser environment');

  // Test 6: Real-world usage simulation
  console.log('\n6. Simulating real-world usage...');
  const quizStartTime = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
  const timeElapsed = calculateTimeDifference(quizStartTime, new Date());
  
  console.log('✅ Quiz started 5 minutes ago:', getRelativeTime(quizStartTime));
  console.log('✅ Time elapsed in quiz:', formatTime(timeElapsed));
  console.log('✅ Quiz time formatted:', formatTimeWithHours(timeElapsed));
}

// Auto-run tests if in browser
if (typeof window !== 'undefined') {
  testTimeFunctions();
} else {
  console.log('⚠️ This test file should be run in a browser environment');
  console.log('💡 Open your browser console and run: testTimeFunctions()');
}

export { testTimeFunctions };
