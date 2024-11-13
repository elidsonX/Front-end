package com.example.restaurante.service;

import com.example.restaurante.model.Pedido;
import com.example.restaurante.model.Item;
import com.example.restaurante.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    // Criar um novo pedido
    @Transactional
    public Pedido criarPedido(Pedido pedido) {
        calcularValorTotal(pedido);
        return pedidoRepository.save(pedido);
    }

    // Buscar um pedido pelo ID
    public Optional<Pedido> getPedido(Long id) {
        return pedidoRepository.findById(id).map(pedido -> {
            System.out.println("Itens: " + pedido.getItens().size());
            return pedido;
        });
    }

    // Listar todos os pedidos
    public List<Pedido> listarTodosPedidos() {
        return pedidoRepository.findAll();
    }

    // Atualizar um pedido existente
    @Transactional
    public Optional<Pedido> atualizarPedido(Long id, Pedido pedidoAtualizado) {
        return pedidoRepository.findById(id)
            .map(pedido -> {
                pedido.setNomeCliente(pedidoAtualizado.getNomeCliente());
                pedido.setEndereco(pedidoAtualizado.getEndereco());
                pedido.setDescricao(pedidoAtualizado.getDescricao());
                pedido.getItens().clear();
                pedido.getItens().addAll(pedidoAtualizado.getItens());
                calcularValorTotal(pedido);
                return pedidoRepository.save(pedido);
            });
    }

    // Deletar um pedido
    @Transactional
    public boolean deletarPedido(Long id) {
        return pedidoRepository.findById(id)
            .map(pedido -> {
                pedidoRepository.delete(pedido);
                return true;
            })
            .orElse(false);
    }

    // Método para calcular o valor total do pedido
    private void calcularValorTotal(Pedido pedido) {
        double total = pedido.getItens().stream()
                .mapToDouble(Item::getPreco)
                .sum();
        pedido.setValorTotal(total);
    }

    // Novo método para limpar todos os pedidos
    @Transactional
    public void limparTodosPedidos() {
        pedidoRepository.deleteAll();
    }
}