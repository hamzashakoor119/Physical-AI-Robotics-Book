# Feature Specification: Actuators in Physical AI (Chapter 3)

**Feature Branch**: `003-actuators-physical-ai`
**Created**: 2025-12-06
**Status**: Draft
**Input**: Chapter 3: Actuators - Core technical chapter covering actuator types, properties, motor control principles, and ROS 2 control integration for Physical AI systems.

## Meta Information

- **Title**: Actuators in Physical AI
- **Type**: Core Technical Chapter
- **Version**: 1.0
- **Difficulty**: Beginner → Intermediate
- **Dependencies**: Chapter 1: Introduction to Physical AI (required), Chapter 2: Sensors (required)
- **Unlocks**: Control Systems, Humanoid Motion, Manipulation

## User Scenarios & Testing *(mandatory)*

This chapter serves learners who completed Chapters 1 and 2 and want to understand how Physical AI systems actuate and move in the world. Completing the perception-action loop, this chapter focuses on the "action" component.

### User Story 1 - Actuator Fundamentals (Priority: P1)

A learner wants to understand what actuators are, how they differ from each other, and their key performance characteristics (torque, speed, precision, bandwidth).

**Why this priority**: Core actuator knowledge is essential for selecting appropriate actuators for robot design and understanding actuation tradeoffs. Without this foundation, learners cannot make informed decisions about robot capabilities or understand control limitations.

**Independent Test**: Learner can define actuators, categorize different types, and explain key properties. Can be tested via actuator classification exercises and property-matching tasks.

**Acceptance Scenarios**:

1. **Given** definitions of electric, hydraulic, pneumatic, and soft actuators, **When** presented with examples (servo motor, hydraulic cylinder, pneumatic gripper, soft robotic hand), **Then** learner correctly categorizes each actuator type and explains basic working principles.
2. **Given** actuator properties (torque, speed, precision, bandwidth), **When** learner analyzes task requirements (e.g., "precise positioning" vs "heavy lifting" vs "fast motion"), **Then** they identify which properties matter most and explain tradeoffs.
3. **Given** the knowledge graph structure (Types → Electric/Hydraulic/Pneumatic/Soft), **When** learner encounters new actuators, **Then** they correctly classify them and predict performance characteristics.

---

### User Story 2 - Technical Understanding and Motor Control (Priority: P2)

A learner wants to understand how electric motors work at a technical level, including motor control principles, PWM signals, and joint-level actuation mapping to robot kinematics.

**Why this priority**: Technical understanding enables learners to implement actuator control, debug motion issues, and understand feedback loops. Builds on P1 actuator categorization with deeper technical details focusing on electric motors (most common in robotics).

**Independent Test**: Learner can explain motor control principles, map actuator commands to joint movements, and understand PWM signal basics. Can be tested via control flow diagrams and kinematics exercises.

**Acceptance Scenarios**:

1. **Given** DC motor, servo motor, and stepper motor descriptions, **When** learner analyzes their control methods, **Then** they explain how each is controlled (voltage/current for DC, position commands for servo, step pulses for stepper) and appropriate use cases.
2. **Given** PWM signal concept (pulse width modulation), **When** learner encounters motor speed control, **Then** they explain how duty cycle maps to motor speed and why PWM is used instead of variable voltage.
3. **Given** a robot arm with 3 joints, **When** learner maps joint angles to actuator positions, **Then** they understand forward/inverse kinematics basics and how actuator commands create motion.
4. **Given** feedback loop concepts from Chapter 2, **When** learner connects sensors (encoders, force sensors) to actuators, **Then** they explain how feedback enables precise position/force control.

---

### User Story 3 - Practical ROS 2 Control Integration (Priority: P3)

A learner wants to command actuators via ROS 2 control nodes, implement simple motion commands, and analyze actuator performance in simulation and real hardware.

**Why this priority**: Practical control skills enable hands-on robot programming. Learners can now command motion and complete the perception-action cycle. Depends on understanding from P1 and P2.

**Independent Test**: Learner can write ROS 2 nodes that publish actuator commands, control simulated robots, and analyze motion quality. Can be tested via coding exercises and simulation tasks.

**Acceptance Scenarios**:

1. **Given** a ROS 2 environment with robot simulation (Gazebo), **When** learner writes a node publishing joint position commands (`JointTrajectory` messages), **Then** robot joints move to commanded positions and learner can observe motion.
2. **Given** ROS 2 Control framework (`ros2_control`), **When** learner configures hardware interface for actuators, **Then** they understand abstraction between high-level commands and low-level hardware communication.
3. **Given** Isaac Sim simulation with a robotic arm, **When** learner sends velocity or torque commands, **Then** they observe different control modes and understand when to use each (position control for precise tasks, velocity for smooth motion, torque for force interaction).
4. **Given** actuator performance metrics (response time, overshoot, steady-state error), **When** learner analyzes simulation results, **Then** they identify control quality issues and propose improvements (tuning gains, adjusting trajectories).

---

### Edge Cases

- **Actuator diversity**: Robots use different actuator combinations (some use only electric, others hydraulic+electric) - focus on principles that transfer across actuator types rather than specific hardware.
- **Hardware access**: Some learners may not have physical actuators/robots - provide comprehensive simulation examples (Gazebo, Isaac Sim) with emphasis on ROS 2 abstraction ensuring code transfers to real hardware.
- **Control theory depth**: Motor control can involve complex control theory (PID tuning, model-based control) - provide intuitive explanations first, defer deep control theory to Chapter 4 (Control Systems).
- **Kinematics complexity**: Robot kinematics can be mathematically intensive - provide conceptual understanding and simple examples, defer detailed kinematics to later chapters on manipulation/humanoid motion.

## Requirements *(mandatory)*

### Functional Requirements

#### Content Requirements

- **FR-001**: Chapter MUST define actuators clearly in the context of Physical AI ("devices that convert control signals into physical motion or force").
- **FR-002**: Chapter MUST explain at least 4 actuator types with working principles:
  - Electric motors (DC motors, servo motors, stepper motors)
  - Hydraulic actuators (fluid pressure, cylinders, valves)
  - Pneumatic actuators (air pressure, compressed air systems)
  - Soft actuators (compliant materials, pneumatic/tendon-driven soft robots)
- **FR-003**: Chapter MUST cover key actuator properties and their implications:
  - Torque (rotational force, load capacity)
  - Speed (angular velocity, response time)
  - Precision (positioning accuracy, repeatability)
  - Bandwidth (frequency response, control loop rate)
- **FR-004**: Chapter MUST explain basic motor control principles:
  - PWM (pulse width modulation) for speed control
  - Position control (feedback loops, encoders)
  - Velocity control (ramp profiles, acceleration limits)
  - Torque/force control (current control, force sensing)
- **FR-005**: Chapter MUST introduce joint-level actuation concepts:
  - Mapping actuator commands to joint angles
  - Forward kinematics basics (joint angles → end effector position)
  - Inverse kinematics concept (desired position → joint angles)
  - Degrees of freedom and workspace limitations
- **FR-006**: Chapter MUST explain actuator limitations and tradeoffs:
  - Speed vs torque tradeoffs (gear ratios, motor characteristics)
  - Precision vs speed tradeoffs (control bandwidth, mechanical backlash)
  - Power consumption and efficiency considerations
  - Size/weight constraints in mobile robots
- **FR-007**: Chapter MUST cover actuator selection criteria for tasks:
  - Manipulation (high precision, moderate speed, variable torque)
  - Locomotion (speed, endurance, variable terrain adaptation)
  - Human-robot interaction (safety, compliance, force limits)
- **FR-008**: Chapter MUST include diagrams for:
  - Actuator type categorization tree
  - Motor control block diagram (PWM, feedback loops)
  - Joint-level actuation schematic (actuators → joints → end effector)
  - At least one actuator performance characteristic plot (torque-speed curve, step response)

#### Code Requirements

- **FR-009**: Chapter MUST include at least 3 ROS 2 code examples:
  - (1) Simple joint position command publisher
  - (2) Joint trajectory control using `JointTrajectory` messages
  - (3) Reading joint states from simulated/real robot (`JointState` subscriber)
- **FR-010**: ROS 2 code examples MUST use ROS 2 Humble or Iron with version specified and message types from `control_msgs`, `trajectory_msgs`, `sensor_msgs` packages.
- **FR-011**: Chapter MUST provide code for commanding actuators through `ros2_control` framework (hardware abstraction layer).
- **FR-012**: Chapter MUST include pseudocode or conceptual code for a simple motion profile (trapezoidal velocity profile, acceleration/deceleration ramps).

#### Simulation Requirements

- **FR-013**: Chapter MUST provide Gazebo simulation setup with at least 2 actuator types (e.g., robotic arm with revolute joints + gripper).
- **FR-014**: Gazebo examples MUST target Fortress or Garden versions with version specified and demonstrate:
  - URDF/SDF actuator configuration (joint types, limits, dynamics)
  - `ros2_control` integration with Gazebo plugins
  - Joint command interfaces (position, velocity, effort)
- **FR-015**: Chapter MUST provide Isaac Sim example demonstrating actuator control and performance analysis:
  - Comparing different control modes (position vs velocity vs torque)
  - Visualizing actuator response (plotting commanded vs actual trajectories)
  - Analyzing control quality metrics (settling time, overshoot, steady-state error)
- **FR-016**: Isaac Sim examples MUST align with official NVIDIA Isaac Sim documentation and specify version.

#### Interactive Elements

- **FR-017**: Chapter MUST include a glossary defining at minimum: Actuator, Electric Motor, Servo Motor, Stepper Motor, Hydraulic Actuator, Pneumatic Actuator, Soft Actuator, Torque, Speed, Precision, Bandwidth, PWM, ROS 2 Node, ros2_control.
- **FR-018**: Chapter MUST include review questions covering conceptual, technical, and practical learning objectives (minimum 12 questions).
- **FR-019**: Review questions MUST test: actuator categorization, property understanding, motor control principles, ROS 2 control integration, actuator selection for tasks.

### Key Entities

- **Chapter Content**: Actuator definitions, types, properties, control principles, kinematics basics (text-based)
- **Knowledge Graph**: Hierarchical structure (Types → Electric/Hydraulic/Pneumatic/Soft → Properties → Control Interface)
- **Code Examples**: ROS 2 nodes for joint position commands, trajectory control, joint state reading; ros2_control configuration
- **Simulation Configurations**: Gazebo actuator plugins (URDF/SDF), Isaac Sim actuator models and control modes
- **Diagrams**: Actuator categorization tree, motor control block diagram, kinematics schematic, performance plots
- **Glossary**: 13+ actuator-related terms with accurate definitions
- **Review Questions**: Assessment items covering theory, technical details, practical control

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Learners can correctly categorize 8 out of 10 actuators by type (electric/hydraulic/pneumatic/soft) after reading the chapter.
- **SC-002**: Learners can explain the working principles of at least 3 electric motor types (DC, servo, stepper) with 80% accuracy.
- **SC-003**: Learners can match actuator properties to task requirements (e.g., "high precision" → servo motor, "heavy lifting" → hydraulic) with 85% accuracy.
- **SC-004**: Learners can explain speed vs torque tradeoffs and identify appropriate gear ratios for given tasks.
- **SC-005**: Learners with ROS 2 experience can write and run a joint position command node within 30 minutes.
- **SC-006**: Learners can create a joint trajectory using `JointTrajectory` messages and command a simulated robot to follow the trajectory.
- **SC-007**: Learners can explain PWM signals and how duty cycle relates to motor speed with 80% comprehension.
- **SC-008**: Learners can map joint angles to actuator commands for a simple 2-3 DOF robot arm.
- **SC-009**: Chapter review questions achieve 75% average correctness rate among learners who completed Chapters 1 and 2.
- **SC-010**: Learners can analyze actuator performance in simulation (response time, overshoot, error) and identify control quality issues with 75% accuracy.
- **SC-011**: Learners can select appropriate actuators for 3 different robot tasks (manipulation, locomotion, HRI) with correct justification.
- **SC-012**: Advanced learners report sufficient depth on motor control and kinematics for understanding control systems (satisfaction target: 75% positive).

## Assumptions

1. **Prerequisite Knowledge**: Assume learners have completed Chapter 1 (perception-action loop, Physical AI concepts) and Chapter 2 (sensors, feedback loops). Basic physics (forces, torque, energy) helpful but not required.

2. **Technical Environment**: Assume learners have:
   - ROS 2 Humble or Iron installed (Linux native or WSL2 on Windows)
   - Gazebo Fortress or Garden for simulation
   - Optional: Isaac Sim for advanced examples (requires NVIDIA GPU)
   - Optional: Physical robot hardware for testing (simulation-first approach)

3. **Learning Context**: This is a core technical chapter completing the perception-action loop foundation from Chapters 1-2. Chapter 4 (Control Systems) will build on actuator knowledge for closed-loop control design.

4. **Actuator Availability**: Learners may not have access to physical actuators/robots. All exercises must have simulation equivalents. ROS 2 and ros2_control abstract hardware details, so code works identically with real and simulated actuators.

5. **Control Theory Depth**: Advanced control theory (PID tuning, model-based control, adaptive control) deferred to Chapter 4 (Control Systems). This chapter focuses on actuator fundamentals and basic command interfaces.

6. **Kinematics Depth**: Detailed robot kinematics (Denavit-Hartenberg parameters, Jacobians, singularities) deferred to later chapters on manipulation and humanoid motion. This chapter provides conceptual understanding and simple examples.

7. **Code Examples**: All ROS 2 code examples tested and verified with specified versions. Code must be copy-pastable and runnable with minimal configuration (assumes ROS 2 workspace setup from previous chapters).

8. **Simulation Focus**: Emphasize simulation-first learning (Gazebo, Isaac Sim) to democratize access. ros2_control hardware abstraction ensures code transfers to real robots with minimal changes (usually just YAML configuration updates).

## Cross-Chapter Dependencies

**Builds on**:
- **Chapter 1: Introduction to Physical AI** - Perception-action loop (actuators complete the "action" side), embodiment, Physical AI definition (required prerequisite)
- **Chapter 2: Sensors** - Feedback loops (sensor feedback enables actuator control), encoder sensors for position feedback (required prerequisite)

**Prepares for**:
- **Chapter 4: Control Systems** - PID control, feedback control design, stability analysis (actuators are the controlled plant)
- **Chapter 5: Digital Twin & Simulation** - Actuator models in simulation, sim-to-real transfer of control policies
- **Chapter 6: AI-Robot Brain (Isaac Sim)** - High-level motion planning using actuator capabilities
- **Chapter N: Humanoid Motion** - Multi-DOF actuation, coordinated movement, balance control
- **Chapter N: Manipulation** - Gripper actuation, force control, compliant manipulation

Later chapters can reference this chapter's actuator types, properties, ROS 2 control patterns, and kinematics concepts.

## Learning Objectives

### Conceptual (Must Understand)

1. Define actuators and their role in Physical AI action generation
2. Distinguish between electric, hydraulic, pneumatic, and soft actuators based on working principles
3. Understand key actuator properties: torque, speed, precision, bandwidth and their implications
4. Explain actuator limitations and tradeoffs (speed vs torque, precision vs bandwidth, power consumption)
5. Understand joint-level actuation and its relationship to robot kinematics
6. Explain actuator selection criteria for different robot tasks (manipulation, locomotion, HRI)

### Technical (Must Be Able to Explain)

1. Describe working principles of DC motors, servo motors, and stepper motors
2. Explain PWM (pulse width modulation) and its role in motor speed control
3. Describe position control using feedback loops and encoders
4. Explain velocity control and acceleration limiting
5. Explain torque/force control using current sensing
6. Describe basic forward kinematics (joint angles → end effector position)
7. Understand inverse kinematics concept (desired position → joint angles)
8. Explain ros2_control framework and hardware abstraction

### Practical (Must Be Able to Do)

1. Select appropriate actuators for specific Physical AI tasks based on requirements
2. Write ROS 2 nodes that publish joint position commands (`JointTrajectory` messages)
3. Subscribe to joint state topics and read actuator feedback
4. Configure Gazebo actuator plugins in URDF/SDF files
5. Command simulated robots through ros2_control interfaces
6. Analyze actuator performance in simulation (response time, accuracy, overshoot)
7. Create simple motion profiles (trapezoidal velocity, smooth trajectories)

## Knowledge Graph Structure

```
Actuators (Root Concept)
│
├── Types (Categorization by Working Principle)
│   ├── Electric Motors (electrical → rotational motion)
│   │   ├── DC Motors (brush/brushless, voltage/current control)
│   │   │   ├── Brushed DC (simple, low cost, wear over time)
│   │   │   └── Brushless DC (BLDC) (efficient, long life, requires electronic commutation)
│   │   ├── Servo Motors (position feedback, closed-loop control, accurate positioning)
│   │   │   ├── Analog Servos (PWM position commands)
│   │   │   └── Digital Servos (higher precision, faster response)
│   │   └── Stepper Motors (discrete steps, open-loop positioning, holding torque)
│   │       ├── Bipolar Steppers (higher torque, H-bridge driver)
│   │       └── Unipolar Steppers (simpler drive, lower torque)
│   │
│   ├── Hydraulic Actuators (fluid pressure → linear/rotational motion)
│   │   ├── Hydraulic Cylinders (linear motion, high force, heavy load)
│   │   ├── Hydraulic Motors (rotational motion, high torque)
│   │   └── Valves & Pumps (control pressure, flow rate)
│   │
│   ├── Pneumatic Actuators (compressed air → motion)
│   │   ├── Pneumatic Cylinders (linear motion, fast, lightweight)
│   │   ├── Pneumatic Grippers (binary open/close, compliant grasp)
│   │   └── Air Muscles (contractile, soft actuation)
│   │
│   └── Soft Actuators (compliant materials, safe HRI)
│       ├── Pneumatic Soft Actuators (air chambers, bending/extending)
│       ├── Tendon-Driven (cables, remote actuation, anthropomorphic hands)
│       └── Shape Memory Alloys (SMA) (heat-activated, slow response)
│
├── Properties (Performance Characteristics)
│   ├── Torque (rotational force, Nm or lb-ft)
│   │   ├── Continuous Torque (sustained operation)
│   │   └── Peak Torque (short bursts, overload capacity)
│   ├── Speed (angular velocity, RPM or rad/s)
│   │   ├── No-Load Speed (maximum without load)
│   │   └── Rated Speed (at nominal load)
│   ├── Precision (positioning accuracy, repeatability)
│   │   ├── Resolution (smallest step, encoder ticks)
│   │   └── Backlash (mechanical play, gear slack)
│   └── Bandwidth (frequency response, control loop rate)
│       ├── Mechanical Bandwidth (physical response time)
│       └── Control Bandwidth (sampling rate, loop frequency)
│
├── Control Principles (How to Command Actuators)
│   ├── Motor Control Basics
│   │   ├── PWM (Pulse Width Modulation) (duty cycle → speed)
│   │   ├── Position Control (feedback from encoders, PID)
│   │   ├── Velocity Control (ramp profiles, acceleration limits)
│   │   └── Torque/Force Control (current sensing, force feedback)
│   ├── Feedback Loops (sensors → controller → actuators)
│   │   ├── Encoders (position feedback, quadrature signals)
│   │   ├── Force/Torque Sensors (contact detection, compliance)
│   │   └── Current Sensors (motor load, overload protection)
│   └── Joint-Level Actuation (mapping to robot kinematics)
│       ├── Forward Kinematics (joint angles → end effector pose)
│       ├── Inverse Kinematics (desired pose → joint angles)
│       └── Workspace (reachable positions, DOF constraints)
│
└── ROS 2 Control Integration (Practical Implementation)
    ├── ros2_control Framework (hardware abstraction layer)
    │   ├── Hardware Interface (real/simulated robot communication)
    │   ├── Controller Manager (load/unload controllers)
    │   └── Joint Command Interfaces (position, velocity, effort)
    ├── Message Types (control_msgs, trajectory_msgs, sensor_msgs)
    │   ├── JointTrajectory (time-parameterized motion)
    │   ├── JointState (current position, velocity, effort)
    │   └── JointCommand (low-level actuator commands)
    ├── Gazebo Integration (simulation actuators)
    │   ├── URDF/SDF Joint Configuration (limits, dynamics, friction)
    │   └── Gazebo ros2_control Plugin (actuator simulation)
    └── Isaac Sim Integration (NVIDIA physics-based simulation)
        ├── Articulation API (joint control, dynamics)
        └── Action Graphs (visual programming, motion scripting)
```

This graph guides content structure and helps learners visualize relationships between actuator types, properties, control methods, and ROS 2 integration.

## Prerequisites

| Concept                       | Required Level  | Notes                                                                 |
|-------------------------------|-----------------|-----------------------------------------------------------------------|
| Chapter 1: Introduction to Physical AI | Required        | Must understand perception-action loop, embodiment, Physical AI definition |
| Chapter 2: Sensors            | Required        | Must understand feedback loops, encoders, sensor-actuator interaction |
| Basic Physics                 | Recommended     | Forces, torque, energy, rotational motion helpful but not required    |
| Basic Math                    | Recommended     | Trigonometry (kinematics angles), vectors helpful but not required    |
| Programming (Python)          | Optional        | Helpful for ROS 2 code examples; conceptual understanding possible without |
| ROS 2 Basics                  | Recommended     | Understanding of topics, nodes, messages from previous chapters       |

## Notes

- This specification is technology-agnostic where possible (focuses on actuator concepts, not specific brands/models).
- Specific technologies (ROS 2, Gazebo, Isaac Sim, ros2_control) are mandated by project requirements and curriculum alignment.
- Chapter structure follows constitutional principle II (Structure First): theory → diagrams → code → simulation → glossary → review questions.
- All technical claims will be verified against official documentation during content creation (ROS 2 docs, ros2_control docs, Gazebo docs, NVIDIA Isaac Sim docs, motor datasheets) per constitutional principle I (Accuracy First).
- Control theory math (PID tuning, transfer functions) presented at conceptual level first, deferred to Chapter 4 for depth.
- Kinematics presented conceptually with simple examples; detailed treatment deferred to manipulation/humanoid motion chapters.
- Simulation-first approach democratizes access (not everyone has robots), but ros2_control abstraction ensures code transfers to real hardware with YAML config changes only.
