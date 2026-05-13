export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  grade: string;
  progress: number; // percentage
  weakTopic?: string;
  recommendation?: string;
}

export interface NoteFolder {
  id: string;
  name: string;
  notesCount: number;
}

export interface ClassNote {
  id: string;
  title: string;
  folderId: string;
  content: string;
  summary?: string;
  keyPoints?: string[];
  flashcards?: { question: string; answer: string }[];
  tags: string[];
  createdAt: string;
  wordCount: number;
}

export interface StudyPlanItem {
  id: string;
  day: string;
  time: string;
  subject: string;
  topic: string;
  duration: string;
  completed: boolean;
  type: 'review' | 'quiz' | 'lecture' | 'exercise';
}

export interface MockQuiz {
  id: string;
  title: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
  }[];
}

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'bio',
    name: 'Biology & Life Sciences',
    icon: 'Leaf',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    grade: 'A-',
    progress: 88,
    weakTopic: 'Photosynthesis dark reactions',
    recommendation: 'Review Light-Independent cycles with interactive tutor simulation.'
  },
  {
    id: 'phys',
    name: 'Physics (Mechanics & Electromagnetism)',
    icon: 'Atom',
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/20',
    grade: 'B',
    progress: 72,
    weakTopic: 'Rotational kinetic energy',
    recommendation: 'Solve 5 step-by-step practice problems with Homework Assistant.'
  },
  {
    id: 'chem',
    name: 'Organic Chemistry',
    icon: 'FlaskConical',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    grade: 'B+',
    progress: 81,
    weakTopic: 'Nucleophilic substitution reaction mechanism',
    recommendation: 'Use Note Summarizer on Chapter 6 PDF notes and practice MCQs.'
  },
  {
    id: 'cs',
    name: 'Computer Science & Python',
    icon: 'Code',
    color: 'text-sky-500',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/20',
    grade: 'A',
    progress: 95,
    weakTopic: 'Dynamic Programming and memoization',
    recommendation: 'Explore dynamic coding challenges using Interactive Coding Assistant.'
  }
];

export const INITIAL_FOLDERS: NoteFolder[] = [
  { id: 'f1', name: 'Biology 101', notesCount: 2 },
  { id: 'f2', name: 'Physics AP', notesCount: 1 },
  { id: 'f3', name: 'CompSci Concepts', notesCount: 2 },
  { id: 'f4', name: 'General Chemistry', notesCount: 1 }
];

export const INITIAL_NOTES: ClassNote[] = [
  {
    id: 'n1',
    title: 'Photosynthesis & Carbon Cycle Notes',
    folderId: 'f1',
    content: `Photosynthesis is a chemical process that occurs in plants, algae, and some bacteria when they are exposed to sunlight. During photosynthesis, water and carbon dioxide are converted into glucose and oxygen. 
The process takes place primarily inside chloroplasts, which contain chlorophyll. Chlorophyll absorbs light energy, primarily from the blue and red parts of the spectrum, while reflecting green.

The overall chemical equation is:
6CO2 + 6H2O + light energy -> C6H12O6 + 6O2

The process consists of two main stages:
1. Light-Dependent Reactions: Occur in the thylakoid membranes. Solar energy is captured by chlorophyll and converted into chemical energy carriers ATP and NADPH. Water molecules are split, releasing oxygen as a byproduct.
2. Light-Independent Reactions (Calvin Cycle): Occur in the stroma. The chemical energy stored in ATP and NADPH is used to capture carbon dioxide and convert it into high-energy sugars like glucose. This stage does not directly require light, but depends on the products of the light-dependent reactions.

Important aspects:
- Stomata: Tiny pores on the leaf surface that control carbon dioxide entry and oxygen exit.
- Chloroplast Structure: Stroma, Thylakoids, Grana (stacks of thylakoids).
- Limiting Factors: Light intensity, CO2 concentration, and temperature.`,
    tags: ['Biology', 'Plant Physiology', 'Photosynthesis'],
    createdAt: '2026-02-15',
    wordCount: 215,
    summary: 'Photosynthesis is the process where plants convert water, carbon dioxide, and solar light into glucose and oxygen. It happens inside plant chloroplasts via two stages: Light-Dependent reactions (occurring in thylakoids, converting water into oxygen and producing energy carriers ATP/NADPH) and Light-Independent reactions or the Calvin Cycle (occurring in stroma, using carbon dioxide and energy carriers to produce glucose).',
    keyPoints: [
      'Chemical Equation: 6CO2 + 6H2O + light energy -> C6H12O6 + 6O2',
      'Location: Takes place within chloroplasts utilizing green chlorophyll pigments.',
      'Two Stages: Light-Dependent (thylakoids, produces ATP, NADPH, and O2 byproduct) and Calvin Cycle (stroma, synthesizes glucose from CO2).',
      'Gas Exchange: Controlled by stomata on leaf surfaces.',
      'Factors affecting rate: Solar light level, CO2 availability, and seasonal temperature changes.'
    ],
    flashcards: [
      { question: 'What is the chemical equation for photosynthesis?', answer: '6CO2 + 6H2O + light -> C6H12O6 + 6O2' },
      { question: 'Where do the light-dependent reactions occur?', answer: 'In the thylakoid membranes of chloroplasts.' },
      { question: 'What products from the light reactions are used in the Calvin Cycle?', answer: 'ATP and NADPH.' },
      { question: 'What is the function of stomata?', answer: 'Microscopic pores that regulate gas exchange (CO2 entry, O2 release) and water loss.' }
    ]
  },
  {
    id: 'n2',
    title: 'Kinematics & Projectile Motion equations',
    folderId: 'f2',
    content: `Kinematics is the subfield of physics that describes the motion of points, bodies, and systems of bodies without considering the forces that cause them to move.
Key terms:
- Displacement (d or s): Change in position (vector).
- Velocity (v): Rate of change of displacement with respect to time (vector). Average velocity = Δx/Δt.
- Acceleration (a): Rate of change of velocity (vector). Average acceleration = Δv/Δt.

Under constant acceleration (such as gravity g = 9.8 m/s² downwards), we use the kinematic SUVAT equations:
1) v = u + at
2) s = ut + 0.5 * a * t²
3) v² = u² + 2as
4) s = 0.5 * (u + v) * t
Where:
u = initial velocity
v = final velocity
a = constant acceleration
t = elapsed time
s = displacement

Projectile Motion:
An object launched into the air undergoes constant downward acceleration of g, while its horizontal velocity remains constant (ignoring air resistance).
- Horizontal displacement: x = u_x * t = (u * cosθ) * t
- Vertical displacement: y = (u * sinθ) * t - 0.5 * g * t²
- Maximum height occurs when vertical velocity v_y = 0.
- Horizontal range is maximized at an angle of 45 degrees.`,
    tags: ['Physics', 'Mechanics', 'Kinematics'],
    createdAt: '2026-02-10',
    wordCount: 205,
    summary: 'Kinematics describes object motion using variables like displacement, velocity, and constant acceleration. Under gravity (9.8 m/s²), motion is predicted using four fundamental SUVAT equations. Projectile motion separates travel into constant horizontal velocity and constant downward vertical acceleration.',
    keyPoints: [
      'Acceleration due to gravity is approximately 9.8 m/s² (downward).',
      'SUVAT equations require constant acceleration to be valid.',
      'Projectile motion is two-dimensional: independent horizontal and vertical components.',
      'Horizontal velocity remains constant throughout flight (in a vacuum).',
      'Maximum vertical height is achieved when the vertical velocity component drops to zero.'
    ],
    flashcards: [
      { question: 'What does SUVAT stand for?', answer: 'S: Displacement, U: Initial velocity, V: Final velocity, A: Acceleration, T: Time.' },
      { question: 'What angle yields the maximum horizontal range for a projectile?', answer: '45 degrees (assuming flat landing and no air drag).' },
      { question: 'What is the vertical velocity of a projectile at its apex?', answer: 'Zero.' }
    ]
  },
  {
    id: 'n3',
    title: 'Python Big-O and Sorting Algorithms',
    folderId: 'f3',
    content: `Understanding algorithm complexity is crucial for writing efficient software. We use Big-O notation to describe execution speed or space requirements as input size N scales.

Common time complexities:
- O(1): Constant time (e.g., hash map lookup, array indexing).
- O(log N): Logarithmic time (e.g., binary search).
- O(N): Linear time (e.g., simple list traversal, finding minimum element).
- O(N log N): Linearithmic time (e.g., optimal sorting algorithms).
- O(N²): Quadratic time (e.g., nested loops, bubble/selection sort).

Common Sorting Algorithms in Python:
1. Bubble Sort: Repeatedly steps through the list, compares adjacent elements, and swaps if in wrong order. Very inefficient: O(N²) worst/average case.
2. Merge Sort: A divide-and-conquer algorithm. Splits the list in half, recursively sorts each half, and merges them. Guaranteed O(N log N) time but requires extra O(N) memory.
3. Quick Sort: Chooses a 'pivot' element, partitions the array around it, and recursively sorts. Average time is O(N log N), but worst-case is O(N²) if pivot selection is poor (e.g., pre-sorted lists). It is in-place, consuming O(log N) stack space.
4. Timsort: Python's built-in sorting algorithm (for .sort() and sorted()). A highly optimized hybrid of Merge Sort and Insertion Sort. Worst-case is O(N log N), but runs in O(N) for nearly sorted inputs. Extremely efficient.`,
    tags: ['Computer Science', 'Algorithms', 'Python'],
    createdAt: '2026-02-08',
    wordCount: 228,
    summary: 'Big-O notation rates code performance as input size grows. Python sorting employs Timsort (hybrid of merge and insertion sort, running in O(N log N) worst-case and O(N) best-case). Quick Sort is fast and in-place but can degrade to O(N²) worst-case. Merge Sort guarantees O(N log N) but uses extra memory.',
    keyPoints: [
      'Big-O represents upper bounds of computational growth.',
      'Bubble Sort is O(N²), making it impractical for large datasets.',
      'Merge Sort uses Divide & Conquer and is guaranteed O(N log N).',
      'Python uses Timsort, an optimized hybrid algorithm.',
      'Quick Sort is highly popular because of low memory overhead and high practical speed.'
    ],
    flashcards: [
      { question: 'What is the average time complexity of Quick Sort?', answer: 'O(N log N)' },
      { question: 'What sorting algorithm does Pythons sorted() function use?', answer: 'Timsort (a hybrid of Merge Sort and Insertion Sort).' },
      { question: 'Why is Merge Sort not always preferred over Quick Sort?', answer: 'Because Merge Sort requires O(N) auxiliary space, whereas Quick Sort is in-place O(log N) memory.' }
    ]
  },
  {
    id: 'n4',
    title: 'Introduction to Artificial Neural Networks',
    folderId: 'f3',
    content: `Artificial Neural Networks (ANNs) are computing systems inspired by the biological neural networks that constitute animal brains.
An ANN is based on a collection of connected units or nodes called artificial neurons, which loosely model the neurons in a biological brain.

Key Concepts:
1. Input Layer: Receives input features (e.g., pixels, text embeddings).
2. Hidden Layers: Perform non-linear transformations on inputs. Deep Learning involves networks with many hidden layers.
3. Output Layer: Produces final predictions (e.g., class probabilities, numerical regression values).
4. Weights and Biases: Learnable parameters adjusted during training.
   z = sum(w_i * x_i) + b
5. Activation Function: Introduces non-linearity to the network, enabling it to learn complex patterns. Examples:
   - ReLU (Rectified Linear Unit): f(x) = max(0, x). Most popular for hidden layers.
   - Sigmoid: f(x) = 1 / (1 + e^-x). Maps output to (0, 1), great for binary classification.
   - Softmax: Converts values into probability distributions, used in multi-class outputs.

Training Process:
- Forward Propagation: Inputs pass through layers to generate prediction.
- Loss Function: Computes error between prediction and true label (e.g., Mean Squared Error or Cross-Entropy).
- Backward Propagation (Backpropagation): Calculates gradients of loss with respect to weights using chain rule.
- Gradient Descent: Optimization algorithm that updates weights to minimize loss.
  w = w - learning_rate * gradient`,
    tags: ['AI', 'Deep Learning', 'Computer Science'],
    createdAt: '2026-02-12',
    wordCount: 236,
    summary: 'Neural networks are biological brain-inspired computer models. They use layered artificial neurons computing weighted sums combined with non-linear activation functions (ReLU, Sigmoid). Training uses forward propagation to compute loss, backpropagation to calculate error gradients, and gradient descent to update weights.',
    keyPoints: [
      'ANNs consist of Input, Hidden, and Output layers of interconnected artificial neurons.',
      'Weights and Biases represent the network’s knowledge and are learned iteratively.',
      'Activation functions (like ReLU or Sigmoid) are essential to solve non-linear equations.',
      'Backpropagation is the application of the calculus chain rule to distribute error gradients.',
      'Gradient Descent utilizes calculated gradients to iteratively nudge network weights toward lower error.'
    ],
    flashcards: [
      { question: 'What is the formula for a basic neural node calculation before activation?', answer: 'z = Σ(w_i * x_i) + b (Sum of weights times inputs, plus bias).' },
      { question: 'Why are activation functions crucial in deep learning?', answer: 'They introduce non-linearity, without which a multi-layer network would collapse into a simple linear combination.' },
      { question: 'What does the ReLU activation function output?', answer: 'f(x) = max(0, x); it returns 0 for negative inputs, and the input itself for positive inputs.' }
    ]
  }
];

export const INITIAL_STUDY_PLAN: StudyPlanItem[] = [
  { id: 'sp1', day: 'Monday', time: '09:00 AM', subject: 'Biology & Life Sciences', topic: 'Review photosynthesis light vs dark cycle', duration: '45 mins', completed: true, type: 'review' },
  { id: 'sp2', day: 'Monday', time: '04:00 PM', subject: 'Computer Science', topic: 'Practice Quick Sort & Merge Sort coding', duration: '60 mins', completed: false, type: 'exercise' },
  { id: 'sp3', day: 'Tuesday', time: '10:00 AM', subject: 'Physics', topic: 'Solve constant acceleration gravity problems', duration: '50 mins', completed: false, type: 'exercise' },
  { id: 'sp4', day: 'Wednesday', time: '11:00 AM', subject: 'Organic Chemistry', topic: 'Notes Summarizer study on Nupeclophilic substitution', duration: '40 mins', completed: false, type: 'review' },
  { id: 'sp5', day: 'Thursday', time: '02:00 PM', subject: 'Biology & Life Sciences', topic: 'Take Photosynthesis quiz generated by AI', duration: '30 mins', completed: false, type: 'quiz' },
  { id: 'sp6', day: 'Friday', time: '03:30 PM', subject: 'Computer Science', topic: 'Neural Networks basics lecture flashcards', duration: '45 mins', completed: false, type: 'review' }
];

export const MOCK_QUIZZES: MockQuiz[] = [
  {
    id: 'q1',
    title: 'Photosynthesis Fundamentals',
    subject: 'Biology & Life Sciences',
    difficulty: 'Easy',
    questions: [
      {
        id: 'q1_1',
        question: 'What is the primary site of photosynthesis inside plant cells?',
        options: ['Mitochondria', 'Chloroplast', 'Ribosome', 'Golgi Apparatus'],
        correctAnswerIndex: 1,
        explanation: 'Photosynthesis occurs inside chloroplasts, which contain chlorophyll to capture light energy.'
      },
      {
        id: 'q1_2',
        question: 'Which raw materials are converted into glucose during photosynthesis?',
        options: ['Oxygen and Nitrogen', 'Carbon Dioxide and Water', 'Glucose and Oxygen', 'Methane and Carbon Monoxide'],
        correctAnswerIndex: 1,
        explanation: 'Carbon dioxide (CO2) from the air and water (H2O) from the soil are combined using light energy to produce glucose (C6H12O6).'
      },
      {
        id: 'q1_3',
        question: 'What gaseous byproduct is released into the atmosphere during the light-dependent reactions?',
        options: ['Carbon Dioxide', 'Nitrogen Gas', 'Oxygen Gas', 'Hydrogen Gas'],
        correctAnswerIndex: 2,
        explanation: 'Water molecules are split during the light-dependent reactions, producing Oxygen (O2) which is released into the air.'
      },
      {
        id: 'q1_4',
        question: 'Where does the Calvin Cycle (light-independent reactions) take place?',
        options: ['In the thylakoid membrane', 'In the stroma of the chloroplast', 'In the cytoplasm', 'In the cell wall'],
        correctAnswerIndex: 1,
        explanation: 'The Calvin Cycle takes place in the stroma, the fluid-filled space surrounding the thylakoids.'
      }
    ]
  },
  {
    id: 'q2',
    title: 'Kinematics & SUVAT Equations',
    subject: 'Physics',
    difficulty: 'Medium',
    questions: [
      {
        id: 'q2_1',
        question: 'Which of the following describes displacement?',
        options: ['Total distance traveled in any path', 'Speed multiplied by time', 'A scalar quantity of length', 'A vector quantity representing change in position'],
        correctAnswerIndex: 3,
        explanation: 'Displacement is a vector quantity pointing from an object’s starting point to its final point.'
      },
      {
        id: 'q2_2',
        question: 'An object is dropped from a high cliff. Assuming no air resistance, what is its acceleration after 3 seconds?',
        options: ['0 m/s²', '9.8 m/s²', '29.4 m/s²', 'None of the above'],
        correctAnswerIndex: 1,
        explanation: 'Under gravity, the downward acceleration remains constant at approximately 9.8 m/s² (assuming no air resistance).'
      },
      {
        id: 'q2_3',
        question: 'If a car starts from rest (u=0) and accelerates at 2 m/s² for 5 seconds, what is its final velocity?',
        options: ['5 m/s', '10 m/s', '20 m/s', '25 m/s'],
        correctAnswerIndex: 1,
        explanation: 'Using SUVAT: v = u + at -> v = 0 + (2 * 5) = 10 m/s.'
      }
    ]
  },
  {
    id: 'q3',
    title: 'Python Sorting & Big-O',
    subject: 'Computer Science',
    difficulty: 'Hard',
    questions: [
      {
        id: 'q3_1',
        question: 'What is the worst-case time complexity of standard Quick Sort when a poor pivot is repeatedly chosen?',
        options: ['O(N)', 'O(N log N)', 'O(N²)', 'O(2^N)'],
        correctAnswerIndex: 2,
        explanation: 'If pivot selection is poor (such as picking extreme values on a sorted array), Quick Sort degrades to O(N²) quadratic time.'
      },
      {
        id: 'q3_2',
        question: 'Which sorting algorithm does Python utilize under the hood for its native sorted() function?',
        options: ['Quick Sort', 'Merge Sort', 'Timsort', 'Heap Sort'],
        correctAnswerIndex: 2,
        explanation: 'Python utilizes Timsort, a hybrid of Merge Sort and Insertion Sort optimized for real-world sorted datasets.'
      },
      {
        id: 'q3_3',
        question: 'Which algorithm is guaranteed to sort an array in O(N log N) time while requiring O(N) auxiliary memory?',
        options: ['Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Merge Sort'],
        correctAnswerIndex: 3,
        explanation: 'Merge Sort guarantees O(N log N) time complexity in all cases but requires O(N) extra helper memory to perform the merges.'
      }
    ]
  }
];

export const MOCK_CHATS = [
  {
    role: 'assistant',
    content: "Hi there! I am your AI Student Assistant, powered by OpenAI's GPT models. How can I help you excel in your studies today? Feel free to ask a complex question, type a math formula, paste code, or try quick actions like 'Explain photosynthesis simply'!"
  }
];
