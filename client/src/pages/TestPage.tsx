import React from 'react';
import PreviewV2 from '../components/PreviewV2';

const TestPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div id='containerDiv' className='h-full max-h-[62vh] w-full max-w-[80vh] bg-red-500 '>
        <PreviewV2
            mode="profile"
            profileName = {"Fake Business Name for Testing Purposes - This is a long name to test the limit".padEnd(75, 'x').substring(0, 75)}
            profileSubText = "Business Account"
            profilePfpUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='50' fill='%23DFE5E7'/%3E%3Cg fill='white'%3E%3Ccircle cx='50' cy='40' r='15'/%3E%3Cpath d='M50,60 C30,60 20,80 20,100 L80,100 C80,80 70,60 50,60 Z'/%3E%3C/g%3E%3C/svg%3E"
            profilePhoneNumber = "+1 (555) 123-4567"
            profileDescription = {"This is a fake business description for testing purposes. It needs to be quite long to reach the character limit of 512. We will repeat some text to ensure it fills up the space. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.".padEnd(512, 'x').substring(0, 512)}
            profileCategory = "E-commerce"
            profileAddress = {"123 Fake Street, Suite 400, Fictional City, State, 90210, United States of America. This address is intentionally long to test the character limit of 512. We are adding more details to make sure it reaches the maximum allowed length. This is a very detailed address for a very important fake business. Testing the boundaries of address fields is crucial for robust UI design and data handling. Ensuring that all characters are displayed correctly and that the layout adapts is key to a good user experience.".padEnd(512, 'x').substring(0, 512)}
            profileEmail = {"test.email.for.fake.business.purposes.to.reach.the.character.limit@example.com".padEnd(128, 'x').substring(0, 128)}
            profileWebsite = {"https://www.fake-business-website-for-testing-purposes-that-is-very-long-to-reach-the-character-limit.com/some/very/deep/path/to/a/specific/page/with/many/parameters?param1=value1&param2=value2&param3=value3&param4=value4&param5=value5".padEnd(256, 'x').substring(0, 256)}
            profileAbout = {"This is a detailed 'About Us' section for our fake business, designed to test the character limit of 139. It provides a brief overview.".padEnd(139, 'x').substring(0, 139)}
        />
      </div>
    </div>
  )
};

export default TestPage;