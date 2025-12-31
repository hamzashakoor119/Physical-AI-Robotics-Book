# Feature Specification: Control Systems for Physical AI (Chapter 4)

**Feature Branch**: `004-control-systems`
**Created**: 2025-12-07
**Status**: Draft
**Input**: Chapter 4: Control Systems - Core technical chapter covering open-loop vs closed-loop control, PID control, stability analysis, and ROS 2 control integration for Physical AI systems.

## Meta Information

- **Title**: Control Systems for Physical AI
- **Type**: Core Technical Chapter
- **Version**: 1.0
- **Difficulty**: Intermediate
- **Dependencies**: Chapter 1: Introduction to Physical AI (required), Chapter 2: Sensors (required), Chapter 3: Actuators (required)
- **Unlocks**: Simulation, Humanoid Control, Isaac Sim Autonomy, Manipulation

## User Scenarios & Testing *(mandatory)*

This chapter serves learners who completed Chapters 1-3 and want to understand how to close the perception-action loop with feedback control. This chapter formalizes control system design, enabling learners to build stable, responsive robotic systems.

### User Story 1 - Control System Fundamentals (Priority: P1)

A learner wants to understand what control systems are, the difference between open-loop and closed-loop control, and why feedback is essential for robust Physical AI systems.

**Why this priority**: Core control concepts are foundational for all robotic systems. Without understanding feedback and error correction, learners cannot design stable, accurate control systems. This is the conceptual foundation that enables technical implementation.

**Independent Test**: Learner can define control systems, distinguish open-loop from closed-loop control, and explain feedback loops. Can be tested via control system classification exercises and feedback loop diagrams.

**Acceptance Scenarios**:

1. **Given** definitions of open-loop and closed-loop control, **When** presented with examples (microwave timer, thermostat, cruise control, robot arm positioning), **Then** learner correctly categorizes each as open-loop or closed-loop and explains why feedback is present or absent.
2. **Given** the perception-action loop from Chapter 1, **When** learner analyzes feedback paths (sensors → controller → actuators → environment → sensors), **Then** they understand how control systems close the loop and enable error correction.
3. **Given** control system performance metrics (rise time, settling time, overshoot, steady-state error), **When** learner analyzes step responses, **Then** they identify performance characteristics and explain tradeoffs (fast response vs stability).

---

### User Story 2 - PID Control Understanding and Tuning (Priority: P2)

A learner wants to understand PID (Proportional-Integral-Derivative) control, how each component affects system behavior, and how to tune PID gains for desired performance.

**Why this priority**: PID control is the most widely used control algorithm in robotics. Understanding P/I/D effects and tuning strategies enables learners to implement and debug control loops. Builds on P1 feedback concepts with concrete implementation details.

**Independent Test**: Learner can explain P/I/D components, predict their effects on system behavior, and apply basic tuning strategies. Can be tested via PID response analysis and tuning exercises.

**Acceptance Scenarios**:

1. **Given** PID equation `u(t) = Kp*e(t) + Ki*∫e(t)dt + Kd*de(t)/dt`, **When** learner analyzes each term, **Then** they explain: Proportional (reduces error proportionally), Integral (eliminates steady-state error), Derivative (reduces overshoot/oscillation).
2. **Given** different Kp/Ki/Kd gain settings, **When** learner simulates step responses, **Then** they observe and predict: high Kp (fast but oscillatory), high Ki (eliminates offset but can cause instability), high Kd (damping, reduced overshoot).
3. **Given** a robot joint with position error, **When** learner applies Ziegler-Nichols or manual tuning, **Then** they systematically adjust gains to achieve desired settling time and overshoot targets.
4. **Given** stability concepts (Routh-Hurwitz, Nyquist), **When** learner encounters oscillation or instability, **Then** they understand root causes and apply stabilization strategies (reducing gains, adding filtering).

---

### User Story 3 - Practical ROS 2 Control Implementation (Priority: P3)

A learner wants to implement PID controllers in ROS 2, integrate them with `ros2_control` framework, and analyze control performance in simulation (Gazebo, Isaac Sim) with realistic noise and delays.

**Why this priority**: Practical control implementation skills enable hands-on robot programming with feedback. Learners can now design complete sensor-control-actuator loops and validate performance. Depends on understanding from P1 and P2.

**Independent Test**: Learner can write ROS 2 PID controllers, configure `ros2_control` controllers, and analyze stability/performance metrics in simulation. Can be tested via coding exercises and simulation analysis tasks.

**Acceptance Scenarios**:

1. **Given** a ROS 2 environment with simulated robot (Gazebo), **When** learner implements a position PID controller subscribing to joint states and publishing commands, **Then** robot tracks desired positions with tunable response characteristics.
2. **Given** `ros2_control` controller plugins (joint_trajectory_controller, position_controller, velocity_controller), **When** learner configures YAML parameters and loads controllers, **Then** they understand controller abstraction and can switch control strategies without code changes.
3. **Given** Isaac Sim simulation with sensor noise and actuator delays, **When** learner compares PID performance vs open-loop, **Then** they quantify feedback benefits (reduced error, disturbance rejection, robustness to model uncertainty).
4. **Given** control performance analysis tools (plotting error, control effort, frequency response), **When** learner evaluates different tuning strategies, **Then** they select gains balancing speed, stability, and energy efficiency.

---

### Edge Cases

- **Control theory depth**: Control theory can be mathematically intensive (Laplace transforms, frequency domain analysis) - provide intuitive explanations first, with optional deep dives for advanced learners. Focus on practical PID tuning over theoretical proofs.
- **Nonlinear systems**: Many Physical AI systems are nonlinear (friction, backlash, saturation) - introduce linear control first (PID), mention nonlinear effects and mitigation strategies (saturation limits, feedforward compensation) without full nonlinear control theory.
- **Multi-input multi-output (MIMO)**: Robots have coupled joints and complex dynamics - focus on single-input single-output (SISO) control per joint first, mention MIMO concepts (coupling, decoupling strategies) for advanced learners.
- **Hardware limitations**: Some learners may not have physical robots - provide comprehensive simulation examples (Gazebo, Isaac Sim) with realistic noise, delays, and dynamics. Emphasize that PID tuning principles transfer from simulation to hardware.

## Requirements *(mandatory)*

### Functional Requirements

#### Content Requirements

- **FR-001**: Chapter MUST define control systems clearly in the context of Physical AI ("systems that use feedback to regulate behavior and achieve desired states despite disturbances and uncertainties").
- **FR-002**: Chapter MUST explain the difference between open-loop and closed-loop control with at least 3 examples each:
  - Open-loop: microwave timer, stepper motor (no feedback), pre-programmed trajectory
  - Closed-loop: thermostat, cruise control, robot joint position control with encoder feedback
- **FR-003**: Chapter MUST cover feedback loop components and their roles:
  - Reference/Setpoint (desired state)
  - Error signal (reference - measured state)
  - Controller (converts error to control action)
  - Actuator (applies control action to plant)
  - Plant/System (physical system being controlled)
  - Sensor (measures actual state)
- **FR-004**: Chapter MUST explain PID control in detail:
  - Proportional (P) term: responds to current error, `u_p = Kp * e(t)`
  - Integral (I) term: eliminates steady-state error, `u_i = Ki * ∫e(t)dt`
  - Derivative (D) term: predicts future error, reduces overshoot, `u_d = Kd * de(t)/dt`
  - Combined PID equation: `u(t) = Kp*e(t) + Ki*∫e(t)dt + Kd*de(t)/dt`
- **FR-005**: Chapter MUST cover control performance metrics with definitions:
  - Rise time (time to reach 90% of setpoint)
  - Settling time (time to stay within ±2% of setpoint)
  - Overshoot (maximum peak beyond setpoint, %)
  - Steady-state error (long-term error after transients)
- **FR-006**: Chapter MUST explain stability concepts:
  - Bounded-input bounded-output (BIBO) stability
  - Oscillation and limit cycles
  - Instability causes (high gains, delays, positive feedback)
  - Qualitative stability analysis (pole locations, damping ratio)
- **FR-007**: Chapter MUST cover PID tuning strategies:
  - Manual tuning (start with P, add D for damping, add I for offset removal)
  - Ziegler-Nichols method (ultimate gain and period)
  - Software tools (auto-tuning, optimization-based tuning)
  - Tuning tradeoffs (speed vs stability, energy efficiency vs responsiveness)
- **FR-008**: Chapter MUST include diagrams for:
  - Feedback control block diagram (reference → error → controller → actuator → plant → sensor → feedback)
  - PID component effects on step response (P-only, PI, PID overlaid)
  - Control performance metrics visualization (rise time, settling time, overshoot on step response plot)
  - At least one frequency response plot (Bode plot showing stability margins) or root locus plot

#### Code Requirements

- **FR-009**: Chapter MUST include at least 3 ROS 2 code examples:
  - (1) Simple P-controller for joint position control
  - (2) Full PID controller with integral anti-windup and derivative filtering
  - (3) Using `ros2_control` controller plugins (joint_trajectory_controller with PID gains)
- **FR-010**: ROS 2 code examples MUST use ROS 2 Humble or Iron with version specified and message types from `control_msgs`, `trajectory_msgs`, `sensor_msgs` packages.
- **FR-011**: Chapter MUST provide code for configuring PID gains via YAML files for `ros2_control` framework (demonstrating parameter-based tuning without recompilation).
- **FR-012**: Chapter MUST include pseudocode or conceptual code for discrete-time PID implementation (accounting for sampling time, integral accumulation, derivative finite difference).

#### Simulation Requirements

- **FR-013**: Chapter MUST provide Gazebo simulation setup demonstrating PID control with at least 2 scenarios:
  - Position control of a single joint (step response analysis)
  - Trajectory tracking with multiple joints (following sine wave or multi-point trajectory)
- **FR-014**: Gazebo examples MUST target Fortress or Garden versions with version specified and demonstrate:
  - Configuring PID controllers in `ros2_control` YAML files
  - Launching controllers via controller_manager
  - Plotting commanded vs actual trajectories using rqt_plot or plotjuggler
- **FR-015**: Chapter MUST provide Isaac Sim example demonstrating control performance analysis:
  - Comparing P, PI, and PID control performance on the same task
  - Introducing realistic sensor noise and actuator delays
  - Quantifying performance metrics (RMSE, settling time, max error)
- **FR-016**: Isaac Sim examples MUST align with official NVIDIA Isaac Sim documentation and specify version.

#### Interactive Elements

- **FR-017**: Chapter MUST include a glossary defining at minimum: Control System, Open-Loop Control, Closed-Loop Control, Feedback, Error Signal, PID Control, Proportional (P), Integral (I), Derivative (D), Setpoint, Plant, Stability, Overshoot, Settling Time, Rise Time, Steady-State Error.
- **FR-018**: Chapter MUST include review questions covering conceptual, technical, and practical learning objectives (minimum 15 questions).
- **FR-019**: Review questions MUST test: open-loop vs closed-loop categorization, feedback loop component identification, PID component effects, tuning strategies, stability analysis, ROS 2 controller configuration.

### Key Entities

- **Chapter Content**: Control system definitions, open-loop vs closed-loop, feedback loops, PID control, stability, tuning strategies (text-based)
- **Knowledge Graph**: Hierarchical structure (Control Types → Feedback Loops → PID Control → Stability → Performance Metrics → ROS 2 Integration)
- **Code Examples**: ROS 2 PID controllers (P-only, full PID), ros2_control YAML configuration, discrete-time PID implementation
- **Simulation Configurations**: Gazebo PID control demos (position control, trajectory tracking), Isaac Sim control performance analysis
- **Diagrams**: Feedback block diagram, PID step response comparison, performance metrics visualization, frequency response plots
- **Glossary**: 15+ control-related terms with accurate definitions
- **Review Questions**: Assessment items covering theory, technical details, practical PID implementation and tuning

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Learners can correctly categorize 8 out of 10 control examples as open-loop or closed-loop and explain feedback presence/absence.
- **SC-002**: Learners can draw a complete feedback control block diagram with all components (reference, error, controller, actuator, plant, sensor) with 85% accuracy.
- **SC-003**: Learners can explain the effect of each PID component (P, I, D) on step response characteristics with 80% comprehension.
- **SC-004**: Learners can predict qualitatively how changing Kp, Ki, Kd affects rise time, overshoot, settling time, and steady-state error.
- **SC-005**: Learners with ROS 2 experience can implement and test a P-controller for a simulated robot joint within 30 minutes.
- **SC-006**: Learners can tune PID gains using manual tuning strategy (P → PD → PID) to achieve specified performance targets (e.g., <10% overshoot, <2s settling time).
- **SC-007**: Learners can identify instability (oscillation, divergence) from step response plots and propose corrective actions (reduce Kp, add damping).
- **SC-008**: Learners can configure `ros2_control` PID controllers via YAML files and verify control performance in Gazebo simulation.
- **SC-009**: Chapter review questions achieve 75% average correctness rate among learners who completed Chapters 1-3.
- **SC-010**: Learners can analyze control performance metrics (RMSE, max error, settling time) from simulation data and compare different tuning strategies.
- **SC-011**: Learners can explain why feedback control is essential for Physical AI systems (disturbance rejection, model uncertainty, sensor noise compensation) with concrete examples.
- **SC-012**: Advanced learners report sufficient depth on stability analysis and frequency domain concepts for further study (satisfaction target: 75% positive).

## Assumptions

1. **Prerequisite Knowledge**: Assume learners have completed Chapter 1 (perception-action loop), Chapter 2 (sensors, feedback), and Chapter 3 (actuators, PWM, joint control). Basic calculus (derivatives, integrals) helpful but not required for conceptual understanding.

2. **Technical Environment**: Assume learners have:
   - ROS 2 Humble or Iron installed (Linux native or WSL2 on Windows)
   - Gazebo Fortress or Garden for simulation
   - Optional: Isaac Sim for advanced examples (requires NVIDIA GPU)
   - Python libraries for plotting (matplotlib, plotjuggler, rqt_plot)

3. **Learning Context**: This is a core technical chapter closing the perception-action loop introduced in Chapters 1-3. Chapters 5-6 (simulation, AI-brain) will build on control knowledge for advanced autonomy.

4. **Mathematical Depth**: Advanced control theory (Laplace transforms, transfer functions, state-space, Nyquist plots) introduced conceptually with optional deep dives. Focus on practical PID implementation and tuning over theoretical proofs.

5. **Control Algorithm Scope**: Focus on PID control as the most widely used algorithm in robotics. Mention advanced control (model predictive control, adaptive control, learning-based control) as future topics without detailed coverage.

6. **Hardware Access**: Learners may not have access to physical robots. All exercises must have simulation equivalents. `ros2_control` abstraction ensures PID controllers work identically with real and simulated actuators (YAML config may differ).

7. **Code Examples**: All ROS 2 code examples tested and verified with specified versions. Code must be copy-pastable and runnable with minimal configuration (assumes ROS 2 workspace and simulation setup from previous chapters).

8. **Simulation Realism**: Emphasize realistic simulation (Gazebo physics, Isaac Sim dynamics) with sensor noise, actuator delays, and disturbances to prepare learners for real-world control challenges.

## Cross-Chapter Dependencies

**Builds on**:
- **Chapter 1: Introduction to Physical AI** - Perception-action loop (control closes the loop), embodiment, real-time constraints (required prerequisite)
- **Chapter 2: Sensors** - Feedback signals (encoders, IMUs provide state measurements for control), sensor noise effects on control (required prerequisite)
- **Chapter 3: Actuators** - Actuator dynamics (motor response time, torque limits), PWM control, joint commands (required prerequisite)

**Prepares for**:
- **Chapter 5: Digital Twin & Simulation** - Control policies in simulation, sim-to-real transfer, control validation
- **Chapter 6: AI-Robot Brain (Isaac Sim)** - High-level AI planning with low-level control loops, hierarchical control
- **Chapter N: Humanoid Control** - Whole-body control, balance control using feedback, multi-DOF coordination
- **Chapter N: Manipulation** - Force control, impedance control, compliant manipulation
- **Chapter N: Autonomous Navigation** - Path following, trajectory tracking, obstacle avoidance using feedback control

Later chapters can reference this chapter's PID control patterns, stability concepts, tuning strategies, and `ros2_control` integration.

## Learning Objectives

### Conceptual (Must Understand)

1. Define control systems and their role in Physical AI loop-closing
2. Distinguish between open-loop and closed-loop control with examples
3. Understand feedback, error correction, and why feedback is essential for robustness
4. Explain stability, oscillation, and instability in control systems
5. Understand control performance metrics: rise time, settling time, overshoot, steady-state error
6. Explain the role of each PID component (P: responsiveness, I: offset elimination, D: damping)

### Technical (Must Be Able to Explain)

1. Describe feedback control block diagram components (reference, error, controller, plant, sensor)
2. Explain PID equation `u(t) = Kp*e(t) + Ki*∫e(t)dt + Kd*de(t)/dt` and each term's effect
3. Describe how Kp affects rise time and steady-state error
4. Explain how Ki eliminates steady-state error and can cause instability
5. Describe how Kd reduces overshoot and oscillation
6. Explain manual PID tuning strategy (P → PD → PID progression)
7. Describe Ziegler-Nichols tuning method (ultimate gain, period)
8. Explain discrete-time PID implementation (sampling time, integral accumulation, derivative filtering)
9. Describe `ros2_control` controller framework and YAML-based parameter tuning

### Practical (Must Be Able to Do)

1. Categorize control systems as open-loop or closed-loop and justify categorization
2. Draw complete feedback control block diagrams for Physical AI tasks
3. Implement a P-controller in ROS 2 for joint position control
4. Implement a full PID controller with anti-windup and derivative filtering
5. Configure PID gains in `ros2_control` YAML files and load controllers
6. Tune PID gains manually to achieve performance targets (overshoot, settling time)
7. Analyze step response plots to identify performance characteristics and stability issues
8. Compare control performance metrics (RMSE, max error, settling time) across different tuning strategies
9. Implement and test PID controllers in Gazebo and Isaac Sim with realistic noise and delays

## Knowledge Graph Structure

```
Control Systems (Root Concept)
│
├── Control Types (Categorization by Feedback)
│   ├── Open-Loop Control (no feedback, pre-programmed)
│   │   ├── Examples (microwave timer, stepper motor open-loop, pre-recorded trajectory)
│   │   ├── Advantages (simple, no sensors needed, deterministic)
│   │   └── Limitations (no error correction, sensitive to disturbances, model uncertainty)
│   │
│   └── Closed-Loop Control (feedback-based, error correction)
│       ├── Examples (thermostat, cruise control, robot position control)
│       ├── Advantages (disturbance rejection, robustness, accuracy)
│       └── Requirements (sensors, real-time computation, stability)
│
├── Feedback Loops (Components and Flow)
│   ├── Reference/Setpoint (desired state, commanded trajectory)
│   ├── Error Signal (e = reference - measured, control input)
│   ├── Controller (PID, state feedback, model predictive)
│   │   ├── Converts error to control action
│   │   └── Determines system response characteristics
│   ├── Actuator (motors, hydraulics, applies control effort)
│   ├── Plant/System (physical robot, dynamics, disturbances)
│   └── Sensor (encoders, IMUs, measures actual state)
│
├── PID Control (Proportional-Integral-Derivative)
│   ├── PID Equation: `u(t) = Kp*e(t) + Ki*∫e(t)dt + Kd*de(t)/dt`
│   │
│   ├── Proportional (P) Term
│   │   ├── Formula: `u_p = Kp * e(t)`
│   │   ├── Effect: Reduces error proportionally, increases responsiveness
│   │   ├── High Kp: Fast response, overshoot, potential instability
│   │   └── Low Kp: Slow response, steady-state error
│   │
│   ├── Integral (I) Term
│   │   ├── Formula: `u_i = Ki * ∫e(t)dt`
│   │   ├── Effect: Eliminates steady-state error, accumulates past errors
│   │   ├── High Ki: No offset, but oscillation and instability risk
│   │   ├── Low Ki: Slow offset correction
│   │   └── Anti-Windup (prevents integral accumulation during saturation)
│   │
│   ├── Derivative (D) Term
│   │   ├── Formula: `u_d = Kd * de(t)/dt`
│   │   ├── Effect: Predicts future error, adds damping, reduces overshoot
│   │   ├── High Kd: Strong damping, noise amplification
│   │   ├── Low Kd: Minimal damping, overshoot
│   │   └── Derivative Filtering (low-pass filter to reduce noise sensitivity)
│   │
│   └── Discrete-Time PID (sampled control)
│       ├── Sampling Time (Ts, control loop frequency)
│       ├── Integral: sum of errors over time (`sum += e * Ts`)
│       ├── Derivative: finite difference (`(e - e_prev) / Ts`)
│       └── Implementation Considerations (anti-windup, saturation, filtering)
│
├── Stability & Performance (Analysis and Metrics)
│   ├── Stability Concepts
│   │   ├── BIBO Stability (bounded input → bounded output)
│   │   ├── Oscillation (sustained periodic response, marginally stable)
│   │   ├── Instability (divergence, exponential growth)
│   │   └── Causes (high gains, time delays, positive feedback, nonlinearities)
│   │
│   ├── Performance Metrics (time-domain analysis)
│   │   ├── Rise Time (t_r, time to 90% of setpoint, affected by Kp)
│   │   ├── Settling Time (t_s, time to stay within ±2%, affected by Kd, Ki)
│   │   ├── Overshoot (Mp, peak beyond setpoint, %, reduced by Kd)
│   │   ├── Steady-State Error (e_ss, long-term error, eliminated by Ki)
│   │   └── RMSE (root mean square error, overall tracking accuracy)
│   │
│   └── Stability Analysis Tools (optional, advanced)
│       ├── Pole Locations (stable if poles in left half-plane)
│       ├── Damping Ratio (ζ, underdamped/critically damped/overdamped)
│       ├── Bode Plot (frequency response, gain/phase margins)
│       └── Nyquist Criterion (encirclements for stability)
│
├── Tuning Strategies (Practical PID Design)
│   ├── Manual Tuning (systematic approach)
│   │   ├── Step 1: Set Ki=0, Kd=0, increase Kp until fast response with acceptable overshoot
│   │   ├── Step 2: Increase Kd to reduce overshoot and oscillation (add damping)
│   │   ├── Step 3: Increase Ki to eliminate steady-state error (watch for instability)
│   │   └── Iterate to balance speed, stability, and accuracy
│   │
│   ├── Ziegler-Nichols Method (classical tuning)
│   │   ├── Find Ultimate Gain (Ku, gain at oscillation onset)
│   │   ├── Find Ultimate Period (Pu, oscillation period at Ku)
│   │   ├── PID Gains: Kp=0.6*Ku, Ki=1.2*Ku/Pu, Kd=0.075*Ku*Pu
│   │   └── Limitations (aggressive tuning, may need refinement)
│   │
│   ├── Software Auto-Tuning (optimization-based)
│   │   ├── Relay Feedback (automatic Ku, Pu identification)
│   │   ├── Optimization Algorithms (minimize cost function: overshoot + settling time)
│   │   └── Adaptive Tuning (real-time gain adjustment)
│   │
│   └── Tuning Tradeoffs
│       ├── Speed vs Stability (fast response vs oscillation risk)
│       ├── Accuracy vs Energy (tight tracking vs control effort)
│       └── Robustness vs Performance (conservative vs aggressive tuning)
│
└── ROS 2 Control Integration (Practical Implementation)
    ├── ros2_control Framework (controller abstraction)
    │   ├── Controller Plugins (joint_trajectory_controller, position_controller, velocity_controller)
    │   ├── Controller Manager (load, configure, start, stop controllers)
    │   ├── Hardware Interface (real/simulated robot, command/state interfaces)
    │   └── YAML Configuration (PID gains, limits, update rates)
    │
    ├── PID Controller Implementation
    │   ├── Custom ROS 2 Node (subscribes to joint states, publishes commands)
    │   ├── PID Class (init, update, reset methods)
    │   ├── Parameters (Kp, Ki, Kd, output limits, anti-windup)
    │   └── Control Loop (timer callback at fixed frequency)
    │
    ├── Gazebo Integration (simulation testing)
    │   ├── Gazebo ros2_control Plugin (actuator simulation, dynamics)
    │   ├── Controller Configuration (YAML files for PID gains)
    │   ├── Visualization (rqt_plot for error, command, state)
    │   └── Performance Analysis (step response, trajectory tracking)
    │
    └── Isaac Sim Integration (NVIDIA physics-based simulation)
        ├── Articulation Controller (PD/PID control with Isaac Sim API)
        ├── Noise and Delay Simulation (realistic sensor/actuator imperfections)
        ├── Control Comparison (P vs PI vs PID, open-loop vs closed-loop)
        └── Metrics Logging (CSV export, Python analysis scripts)
```

This graph guides content structure and helps learners visualize relationships between control types, feedback loops, PID components, stability concepts, tuning strategies, and ROS 2 integration.

## Prerequisites

| Concept                             | Required Level | Notes                                                                 |
|-------------------------------------|----------------|-----------------------------------------------------------------------|
| Chapter 1: Introduction to Physical AI | Required       | Must understand perception-action loop, embodiment, real-time AI     |
| Chapter 2: Sensors                  | Required       | Must understand feedback, sensor noise, encoders for position feedback |
| Chapter 3: Actuators                | Required       | Must understand actuator dynamics, PWM, joint control, ros2_control basics |
| Basic Calculus                      | Optional       | Derivatives (D term), integrals (I term) helpful for PID math understanding |
| Basic Physics                       | Recommended    | Forces, torque, dynamics helpful for plant modeling                  |
| Programming (Python)                | Recommended    | Essential for ROS 2 controller implementation                        |
| ROS 2 Basics                        | Required       | Understanding of topics, nodes, messages, parameters from previous chapters |
| Control Theory                      | Optional       | Formal control theory (Laplace, transfer functions) helpful but not required |

## Notes

- This specification is technology-agnostic where possible (focuses on control concepts, not specific brands/models).
- Specific technologies (ROS 2, Gazebo, Isaac Sim, ros2_control) are mandated by project requirements and curriculum alignment.
- Chapter structure follows constitutional principle II (Structure First): theory → diagrams → code → simulation → glossary → review questions.
- All technical claims will be verified against official documentation during content creation (ROS 2 docs, ros2_control docs, control theory textbooks, Gazebo docs, NVIDIA Isaac Sim docs) per constitutional principle I (Accuracy First).
- Advanced control theory (state-space, optimal control, nonlinear control) mentioned conceptually but deferred to advanced chapters or graduate-level study.
- Emphasis on practical PID implementation and tuning over theoretical analysis (frequency domain, root locus) to maintain accessibility for intermediate learners.
- Simulation-first approach with realistic noise, delays, and disturbances prepares learners for real-world deployment challenges.
- `ros2_control` abstraction ensures PID controllers work identically with real and simulated robots (YAML config may differ for hardware limits).
