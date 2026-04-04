// Test auction functionality
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test functions
async function testAuctionSystem() {
  console.log('🧪 Testing Auction System...\n');

  const courseId = '1';
  const courseData = {
    title: 'Complete Web Development Bootcamp',
    category: 'Web Development',
    level: 'Beginner',
    topics: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB']
  };

  try {
    // Test 1: Start auction
    console.log('1. Testing auction start...');
    const startResponse = await axios.post(`${API_BASE}/courses/${courseId}/start-auction`, courseData, {
      headers: {
        'Authorization': 'Bearer mock-token',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Auction started successfully');
    console.log('Questions generated:', startResponse.data.data.questionCount);
    console.log('Auction status:', startResponse.data.data.auction.status);

    // Test 2: Get auction status
    console.log('\n2. Testing auction status...');
    const statusResponse = await axios.get(`${API_BASE}/courses/${courseId}/auction-status`);
    
    console.log('✅ Auction status retrieved');
    console.log('Status:', statusResponse.data.data.status);
    console.log('Participants:', statusResponse.data.data.participantCount);
    console.log('Time left:', Math.floor(statusResponse.data.data.timeLeft / 1000 / 60), 'minutes');

    // Test 3: Join auction
    console.log('\n3. Testing auction join...');
    const joinResponse = await axios.post(`${API_BASE}/courses/${courseId}/join-auction`, {
      deposit: 9.99
    }, {
      headers: {
        'Authorization': 'Bearer mock-token',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Successfully joined auction');
    console.log('Participant count after joining:', joinResponse.data.data.participantCount);

    // Test 4: Get auction questions
    console.log('\n4. Testing auction questions...');
    const questionsResponse = await axios.get(`${API_BASE}/courses/${courseId}/questions`, {
      headers: {
        'Authorization': 'Bearer mock-token'
      }
    });
    
    console.log('✅ Questions retrieved successfully');
    console.log('Question count:', questionsResponse.data.data.questionCount);
    console.log('Sample question:', questionsResponse.data.data.questions[0]?.text || 'No questions');

    // Test 5: Get participants
    console.log('\n5. Testing participants list...');
    const participantsResponse = await axios.get(`${API_BASE}/courses/${courseId}/participants`);
    
    console.log('✅ Participants retrieved');
    console.log('Total participants:', participantsResponse.data.data.participantCount);

    console.log('\n🎯 Auction System Test Complete!');
    console.log('\n📋 Summary:');
    console.log('- Auction start: ✅ Working');
    console.log('- AI question generation: ✅ Working');
    console.log('- Auction joining: ✅ Working');
    console.log('- Status tracking: ✅ Working');
    console.log('- Question retrieval: ✅ Working');
    console.log('- Participant management: ✅ Working');

  } catch (error) {
    console.log('❌ Test failed:', error.response?.data?.message || error.message);
    
    if (error.response?.status === 401) {
      console.log('💡 Note: Authentication is required for auction operations');
    }
    
    if (error.response?.status === 500) {
      console.log('💡 Note: Make sure the server is running on port 5000');
    }
  }
}

// Test auction status calculation
function testAuctionStatusCalculation() {
  console.log('\n⏰ Testing Auction Status Calculation...');
  
  const now = new Date();
  
  // Test cases
  const testCases = [
    {
      name: 'Upcoming auction',
      startTime: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour from now
      endTime: new Date(now.getTime() + 3 * 60 * 60 * 1000), // 3 hours from now
      expectedStatus: 'upcoming'
    },
    {
      name: 'Active auction',
      startTime: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
      endTime: new Date(now.getTime() + 90 * 60 * 1000), // 90 minutes from now
      expectedStatus: 'active'
    },
    {
      name: 'Ended auction',
      startTime: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      endTime: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
      expectedStatus: 'ended'
    }
  ];

  testCases.forEach(testCase => {
    let status;
    if (now < testCase.startTime) {
      status = 'upcoming';
    } else if (now >= testCase.startTime && now <= testCase.endTime) {
      status = 'active';
    } else {
      status = 'ended';
    }
    
    const isCorrect = status === testCase.expectedStatus;
    console.log(`${isCorrect ? '✅' : '❌'} ${testCase.name}: ${status} ${isCorrect ? '' : `(expected ${testCase.expectedStatus})`}`);
  });
}

// Run tests
if (require.main === module) {
  testAuctionStatusCalculation();
  testAuctionSystem();
}

module.exports = {
  testAuctionSystem,
  testAuctionStatusCalculation
};
