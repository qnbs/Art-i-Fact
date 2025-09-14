import type { Gallery } from '../types';

export const communityGalleries: Gallery[] = [
  {
    id: 'comm_1',
    title: 'Echoes of the Renaissance',
    description: 'A collection exploring the transition from classical ideals to humanist expression, focusing on key portraits and allegories.',
    createdAt: '2023-10-26T10:00:00Z',
    updatedAt: '2023-10-26T12:30:00Z',
    status: 'published',
    projectId: null,
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/400px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
    curatorProfile: {
      username: 'ArtHistorianAnna',
      bio: 'PhD in Renaissance Art. Fascinated by the stories behind the canvas.',
      avatar: 'avatar-1'
    },
    artworks: [
      {
        id: 'feat_2',
        title: 'Mona Lisa',
        artist: 'Leonardo da Vinci',
        year: 'c. 1503–1506',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
        thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/400px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
        description: 'A half-length portrait painting by the Italian Renaissance artist Leonardo da Vinci that has been described as "the best known, the most visited, the most written about, the most sung about, the most parodied work of art in the world".',
      },
      {
        id: 'wiki_198214',
        title: 'The Birth of Venus',
        artist: 'Sandro Botticelli',
        year: 'c. 1486',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg',
        thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/400px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg',
        description: 'A painting by the Italian artist Sandro Botticelli, probably made in the mid 1480s. It depicts the goddess Venus arriving at the shore after her birth, when she had emerged from the sea fully-grown.',
      }
    ]
  },
  {
    id: 'comm_2',
    title: 'Dutch Light & Shadow',
    description: 'A study of the Dutch Golden Age, focusing on the masterful use of light and shadow in portraits and everyday scenes.',
    createdAt: '2023-11-05T15:00:00Z',
    updatedAt: '2023-11-05T16:00:00Z',
    status: 'published',
    projectId: null,
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/400px-1665_Girl_with_a_Pearl_Earring.jpg',
    curatorProfile: {
      username: 'VermeerFan_NL',
      bio: 'Lover of light, shadow, and the quiet moments of the Dutch Golden Age.',
      avatar: 'avatar-4'
    },
    artworks: [
      {
        id: 'feat_5',
        title: 'Girl with a Pearl Earring',
        artist: 'Johannes Vermeer',
        year: 'c. 1665',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg',
        thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/400px-1665_Girl_with_a_Pearl_Earring.jpg',
        description: 'An oil painting by Dutch Golden Age painter Johannes Vermeer. It is a tronie of a girl with a headscarf and a pearl earring.',
      },
      {
        id: 'wiki_522813',
        title: 'The Night Watch',
        artist: 'Rembrandt van Rijn',
        year: '1642',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/The_Night_Watch_-_Rembrandt_van_Rijn.jpg/1280px-The_Night_Watch_-_Rembrandt_van_Rijn.jpg',
        thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/The_Night_Watch_-_Rembrandt_van_Rijn.jpg/400px-The_Night_Watch_-_Rembrandt_van_Rijn.jpg',
        description: 'Militia Company of District II under the Command of Captain Frans Banninck Cocq, also known as The Shooting Company of Frans Banning Cocq and Willem van Ruytenburch, but commonly referred to as The Night Watch, is a 1642 painting by Rembrandt van Rijn.',
      }
    ]
  },
   {
    id: 'comm_3',
    title: 'AI Dreamscapes',
    description: 'A journey into the surreal and impossible, crafted entirely by AI. Exploring themes of technology, nature, and the subconscious.',
    createdAt: '2023-11-10T18:00:00Z',
    updatedAt: '2023-11-10T19:30:00Z',
    status: 'published',
    projectId: null,
    thumbnailUrl: 'https://storage.googleapis.com/aistudio-bucket/ae8f572a-c216-4a49-96d5-188e67a5f607.jpeg',
    curatorProfile: {
      username: 'SynthWaveSurfer',
      bio: 'Exploring the digital canvas. Prompt engineer and AI art enthusiast.',
      avatar: 'avatar-5'
    },
    artworks: [
      {
        id: 'ai_1',
        title: 'Astronaut riding a whale through the clouds',
        artist: 'Art-i-Fact AI Studio',
        year: '2023',
        isGenerated: true,
        imageUrl: 'https://storage.googleapis.com/aistudio-bucket/ae8f572a-c216-4a49-96d5-188e67a5f607.jpeg',
        thumbnailUrl: 'https://storage.googleapis.com/aistudio-bucket/ae8f572a-c216-4a49-96d5-188e67a5f607.jpeg',
        description: 'AI-generated artwork based on the prompt: "Astronaut riding a whale through the clouds, epic, cinematic lighting, detailed, octane render".',
      },
      {
        id: 'ai_2',
        title: 'A library where the books are made of flowing water',
        artist: 'Art-i-Fact AI Studio',
        year: '2023',
        isGenerated: true,
        imageUrl: 'https://storage.googleapis.com/aistudio-bucket/22a275f0-67c9-4177-8332-263a8a3c89b9.jpeg',
        thumbnailUrl: 'https://storage.googleapis.com/aistudio-bucket/22a275f0-67c9-4177-8332-263a8a3c89b9.jpeg',
        description: 'AI-generated artwork based on the prompt: "A library where the books are made of flowing water, surreal, magical, glowing particles, detailed".',
      }
    ]
  },
];
