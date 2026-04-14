import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const LeaveBalanceChart = ({ used, available }) => {
    const data = [
        { name: 'Used', value: used },
        { name: 'Available', value: available },
    ];

    const COLORS = ['#d4af37', '#f5f0db'];
    const DARK_COLORS = ['#d4af37', '#1a1a1a'];

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={document.documentElement.classList.contains('dark') ? DARK_COLORS[index] : COLORS[index]} 
                            />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            backgroundColor: 'white'
                        }}
                    />
                    <Legend iconType="circle" verticalAlign="bottom" height={36}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LeaveBalanceChart;
